import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChange, getCurrentUser, getUserData, signOutUser, User } from '../firebase/auth';
import { listenToCart, Cart } from '../firebase/database';

interface FirebaseContextType {
  user: User | null;
  loading: boolean;
  cart: Cart | null;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

interface FirebaseProviderProps {
  children: React.ReactNode;
}

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<Cart | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get user data from Firestore
          const userData = await getUserData(firebaseUser.uid);
          setUser(userData);
          
          // Listen to cart changes
          const cartUnsubscribe = listenToCart(firebaseUser.uid, (cartData) => {
            setCart(cartData);
          });
          
          // Cleanup cart listener when user changes
          return () => cartUnsubscribe();
        } catch (error) {
          console.error('Error getting user data:', error);
          setUser(null);
        }
      } else {
        setUser(null);
        setCart(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await signOutUser();
      setUser(null);
      setCart(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const refreshUser = async () => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      try {
        const userData = await getUserData(currentUser.uid);
        setUser(userData);
      } catch (error) {
        console.error('Error refreshing user data:', error);
      }
    }
  };

  const value: FirebaseContextType = {
    user,
    loading,
    cart,
    signOut,
    refreshUser
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};
