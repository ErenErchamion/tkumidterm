import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../utils/firebase';

type AuthContextValue = {
  user: User | null;
  idToken: string | null;
  isAdmin: boolean;
  loading: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const token = await currentUser.getIdToken(true);
          setIdToken(token);
          
          const tokenResult = await currentUser.getIdTokenResult();
          const adminClaim = tokenResult.claims.admin === true || tokenResult.claims.is_admin === true || tokenResult.claims.role === 'admin';
          const emailMatch = currentUser.email?.toLowerCase() === 'eren.erkoc.66@gmail.com';
          
          setIsAdmin(adminClaim || emailMatch);
        } catch (error) {
          console.error('Error fetching token details:', error);
          setIdToken(null);
          setIsAdmin(false);
        }
      } else {
        setIdToken(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    setLoading(true);
    await signOut(auth);
  };

  const value = {
    user,
    idToken,
    isAdmin,
    loading,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }
  return context;
};
