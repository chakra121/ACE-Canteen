import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  collection,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { UserProfile } from "@/types";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  rollNumber: string;
  phoneNumber: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserProfile>;
  register: (data: RegisterFormData) => Promise<UserProfile>;
  loginWithGoogle: () => Promise<{ status: "new" | "existing"; user: UserProfile }>;
  completeGoogleRegistration: (
    rollNumber: string,
    phoneNumber: string
  ) => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

// Helper function to fetch user profile from Firestore
const fetchUserProfile = async (firebaseUser: FirebaseUser): Promise<UserProfile | null> => {
  const userRef = doc(db, "users", firebaseUser.uid);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    // Combine the UID from the auth object with the data from Firestore
    return { uid: firebaseUser.uid, ...userSnap.data() } as UserProfile;
  }
  return null;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userProfile = await fetchUserProfile(firebaseUser);
        console.log("Fetched user profile:", userProfile); // Add this line
        setUser(userProfile);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<UserProfile> => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const userProfile = await fetchUserProfile(cred.user);
    if (!userProfile) {
      throw new Error("User profile not found in Firestore.");
    }
    setUser(userProfile);
    return userProfile;
  };

  const register = async (data: RegisterFormData): Promise<UserProfile> => {
    const { email, password, name, rollNumber, phoneNumber } = data;

    // 1. Check for uniqueness of rollNumber and phoneNumber
    const rollNumberQuery = query(collection(db, "users"), where("rollNumber", "==", rollNumber));
    const phoneQuery = query(collection(db, "users"), where("phoneNumber", "==", phoneNumber));
    
    const [rollNumberSnap, phoneSnap] = await Promise.all([
      getDocs(rollNumberQuery),
      getDocs(phoneQuery),
    ]);

    if (!rollNumberSnap.empty) {
      throw new Error("Roll number already exists.");
    }
    if (!phoneSnap.empty) {
      throw new Error("Phone number already exists.");
    }

    // 2. Create user in Firebase Auth
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    
    // 3. Create user profile in Firestore
    const newUserProfile: UserProfile = {
      uid: cred.user.uid,
      email,
      name,
      rollNumber,
      phoneNumber,
      role: "student",
    };

    await setDoc(doc(db, "users", cred.user.uid), {
      ...newUserProfile,
      createdAt: serverTimestamp(),
    });
    
    setUser(newUserProfile);
    return newUserProfile;
  };

  const loginWithGoogle = async (): Promise<{ status: "new" | "existing"; user: UserProfile }> => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const firebaseUser = result.user;

    if (!firebaseUser.email) throw new Error("Google account has no email.");

    const userProfile = await fetchUserProfile(firebaseUser);

    if (userProfile) {
      // Existing user
      setUser(userProfile);
      return { status: "existing", user: userProfile };
    } else {
      // New user
      const newUserProfile: UserProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName || "",
        role: "student",
        // These will be collected in the next step
        rollNumber: '', 
        phoneNumber: '',
      };
      
      await setDoc(doc(db, "users", firebaseUser.uid), {
        ...newUserProfile,
        createdAt: serverTimestamp(),
      });

      setUser(newUserProfile);
      return { status: "new", user: newUserProfile };
    }
  };

  const completeGoogleRegistration = async (
    rollNumber: string,
    phoneNumber: string
  ) => {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("No authenticated user");

    // Check for uniqueness before updating
    const rollNumberQuery = query(collection(db, "users"), where("rollNumber", "==", rollNumber));
    const phoneQuery = query(collection(db, "users"), where("phoneNumber", "==", phoneNumber));
    
    const [rollNumberSnap, phoneSnap] = await Promise.all([
      getDocs(rollNumberQuery),
      getDocs(phoneQuery),
    ]);

    if (!rollNumberSnap.empty) {
      throw new Error("Roll number already exists.");
    }
    if (!phoneSnap.empty) {
      throw new Error("Phone number already exists.");
    }

    const userRef = doc(db, "users", currentUser.uid);
    await updateDoc(userRef, { rollNumber, phoneNumber });
    
    // Update local user state
    setUser(prevUser => prevUser ? { ...prevUser, rollNumber, phoneNumber } : null);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("No authenticated user");

    const userRef = doc(db, "users", currentUser.uid);
    await updateDoc(userRef, data);
    
    // Refresh user state
    const updatedProfile = await fetchUserProfile(currentUser);
    setUser(updatedProfile);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        loginWithGoogle,
        completeGoogleRegistration,
        updateUserProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
