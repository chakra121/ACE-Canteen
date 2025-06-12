
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  rollNumber?: string;
  phoneNumber: string;
  role: 'student' | 'admin';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
}

interface RegisterData {
  name: string;
  email: string;
  rollNumber: string;
  phoneNumber: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing session
    const savedUser = localStorage.getItem('aceCanteenUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate login - in real app, this would call Firebase Auth
      const mockUser: User = {
        id: Math.random().toString(),
        email,
        name: email === 'admin@acecanteen.com' ? 'Admin' : 'Student User',
        phoneNumber: '1234567890',
        role: email === 'admin@acecanteen.com' ? 'admin' : 'student',
        rollNumber: email === 'admin@acecanteen.com' ? undefined : 'CS2021001'
      };
      
      setUser(mockUser);
      localStorage.setItem('aceCanteenUser', JSON.stringify(mockUser));
    } catch (error) {
      throw new Error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setLoading(true);
    try {
      // Simulate registration
      const newUser: User = {
        id: Math.random().toString(),
        ...userData,
        role: 'student'
      };
      
      setUser(newUser);
      localStorage.setItem('aceCanteenUser', JSON.stringify(newUser));
    } catch (error) {
      throw new Error('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('aceCanteenUser');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
