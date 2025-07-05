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
  User,
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
} from "firebase/firestore";
import { auth, db } from "../lib/firebase";

interface AppUser {
  uid: string;
  email: string | null;
  role: string;
  name?: string;
  phoneNumber?: string;
  rollNumber?: string;
}

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  rollNumber: string;
  phoneNumber: string;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  loginWithGoogle: () => Promise<"new" | "existing">;
  completeGoogleRegistration: (
    rollNumber: string,
    phoneNumber: string
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser?.email) {
        const q = query(
          collection(db, "users"),
          where("email", "==", firebaseUser.email)
        );
        const querySnap = await getDocs(q);
        const userData = querySnap.empty ? null : querySnap.docs[0].data();

        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          role: userData?.role || "student",
          name: userData?.name,
          phoneNumber: userData?.phoneNumber,
          rollNumber: userData?.rollNumber,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const userRef = doc(db, "users", cred.user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();

      setUser({
        uid: cred.user.uid,
        email: cred.user.email,
        role: userData.role || "student",
        name: userData.name || "",
        phoneNumber: userData.phoneNumber || "",
        rollNumber: userData.rollNumber || "",
      });
    } else {
      // If no Firestore document found, fallback
      setUser({
        uid: cred.user.uid,
        email: cred.user.email,
        role: "student",
      });
    }
  };
  

  const register = async (data: RegisterFormData) => {
    const { email, password, name, rollNumber, phoneNumber } = data;

    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", cred.user.uid), {
      email,
      name,
      rollNumber,
      phoneNumber,
      role: "student",
      createdAt: new Date().toISOString(),
    });
  };

  const loginWithGoogle = async (): Promise<"new" | "existing"> => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const email = result.user.email;
    const uid = result.user.uid;

    if (!email) throw new Error("Google account has no email");

    const q = query(collection(db, "users"), where("email", "==", email));
    const querySnap = await getDocs(q);

    if (querySnap.empty) {
      await setDoc(doc(db, "users", uid), {
        email,
        name: result.user.displayName || "",
        phoneNumber: result.user.phoneNumber || "",
        role: "student",
        createdAt: new Date().toISOString(),
      });

      setUser({
        uid,
        email,
        role: "student",
        name: result.user.displayName || "",
        phoneNumber: result.user.phoneNumber || "",
      });

      return "new";
    } else {
      const userData = querySnap.docs[0].data();
      setUser({
        uid,
        email,
        role: userData.role,
        name: userData.name,
        phoneNumber: userData.phoneNumber,
        rollNumber: userData.rollNumber,
      });

      return "existing";
    }
  };

  const completeGoogleRegistration = async (
    rollNumber: string,
    phoneNumber: string
  ) => {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("No authenticated user");

    const userRef = doc(db, "users", currentUser.uid);
    await updateDoc(userRef, { rollNumber, phoneNumber });
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
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
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
