import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User as FirebaseUser,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { AdminAuthContextType, AdminUserData } from './types';

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [adminData, setAdminData] = useState<AdminUserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkAdminRole = async (firebaseUser: FirebaseUser): Promise<AdminUserData | null> => {
    try {
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        if (data.role === 'admin') {
          // Update lastLoginAt
          try {
            await setDoc(userDocRef, { lastLoginAt: new Date().toISOString() }, { merge: true });
          } catch {
            // Non-blocking log update
          }
          return {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            role: 'admin',
            displayName: data.displayName || firebaseUser.displayName || 'Administrator',
            createdAt: data.createdAt,
            lastLoginAt: new Date().toISOString()
          };
        }
      }
      return null;
    } catch (err: unknown) {
      console.error('Error verifying admin authorization:', err);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const adminRole = await checkAdminRole(currentUser);
        if (adminRole) {
          setAdminData(adminRole);
          setError(null);
        } else {
          setAdminData(null);
          // If logged into Firebase but not marked as admin in Firestore
          await firebaseSignOut(auth);
          setUser(null);
          setError('Access Denied: This account does not have administrator privileges.');
        }
      } else {
        setUser(null);
        setAdminData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, pass: string) => {
    setError(null);
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), pass);
      const firebaseUser = userCredential.user;
      
      const adminRole = await checkAdminRole(firebaseUser);
      if (!adminRole) {
        await firebaseSignOut(auth);
        setUser(null);
        setAdminData(null);
        throw new Error('Access Denied: Your account does not have verified administrator privileges.');
      }

      setUser(firebaseUser);
      setAdminData(adminRole);
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : 'Authentication failed';
      
      if (errMessage.includes('auth/invalid-credential') || errMessage.includes('auth/wrong-password') || errMessage.includes('auth/user-not-found')) {
        setError('Invalid administrator email or password.');
      } else if (errMessage.includes('auth/too-many-requests')) {
        setError('Too many failed attempts. Please wait a few minutes before trying again.');
      } else {
        setError(errMessage);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setError(null);
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setAdminData(null);
    } catch (err: unknown) {
      console.error('Sign out error:', err);
    }
  };

  const clearError = () => setError(null);

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        adminData,
        loading,
        error,
        signIn,
        logout,
        clearError
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
