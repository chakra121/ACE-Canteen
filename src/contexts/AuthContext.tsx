// src/contexts/AuthContext.tsx
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
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

interface AppUser {
  uid: string;
  email: string | null;
  role: string;
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
  completeGoogleRegistration: (rollNumber: string, phoneNumber: string) => Promise<void>;
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
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        const role = userDoc.exists() ? userDoc.data().role : "student";

        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          role,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
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
    const userRef = doc(db, "users", result.user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        email: result.user.email,
        name: result.user.displayName,
        phoneNumber: result.user.phoneNumber || "",
        role: "student",
        createdAt: new Date().toISOString(),
      });
      return "new";
    }

    return "existing";
  };

  const completeGoogleRegistration = async (rollNumber: string, phoneNumber : string) => {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("No authenticated user");

    const userRef = doc(db, "users", currentUser.uid);
    await updateDoc(userRef, { rollNumber , phoneNumber });
  };

  const logout = async () => {
    await signOut(auth);
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
