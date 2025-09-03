import { 
  signInWithPhoneNumber, 
  RecaptchaVerifier, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  PhoneAuthProvider,
  signInWithCredential
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { auth, db } from './config';

// User interface
export interface User {
  uid: string;
  phone: string;
  name: string;
  email?: string;
  isVerified: boolean;
  isAdmin?: boolean;
  createdAt: Date;
  lastLogin: Date;
  addresses?: Address[];
  preferences?: UserPreferences;
}

export interface Address {
  id: string;
  type: 'Home' | 'Work' | 'Other';
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  isDefault?: boolean;
}

export interface UserPreferences {
  notifications: boolean;
  emailUpdates: boolean;
  language: string;
  currency: string;
}

// Initialize reCAPTCHA
let recaptchaVerifier: RecaptchaVerifier | null = null;

export const initializeRecaptcha = (containerId: string) => {
  if (!recaptchaVerifier) {
    recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {
        console.log('reCAPTCHA solved');
      },
      'expired-callback': () => {
        console.log('reCAPTCHA expired');
      }
    });
  }
  return recaptchaVerifier;
};

// Send OTP
export const sendOTP = async (phoneNumber: string, containerId: string): Promise<string> => {
  try {
    const verifier = initializeRecaptcha(containerId);
    const confirmationResult = await signInWithPhoneNumber(auth, `+91${phoneNumber}`, verifier);
    
    // Store confirmation result for verification
    (window as any).confirmationResult = confirmationResult;
    
    return 'OTP sent successfully';
  } catch (error: any) {
    console.error('Error sending OTP:', error);
    throw new Error(error.message || 'Failed to send OTP');
  }
};

// Verify OTP
export const verifyOTP = async (otp: string): Promise<User> => {
  try {
    const confirmationResult = (window as any).confirmationResult;
    if (!confirmationResult) {
      throw new Error('No OTP confirmation found. Please request OTP again.');
    }

    const result = await confirmationResult.confirm(otp);
    const user = result.user;

    // Check if user exists in Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (userDoc.exists()) {
      // Update last login
      await updateDoc(doc(db, 'users', user.uid), {
        lastLogin: serverTimestamp()
      });
      
      return {
        uid: user.uid,
        ...userDoc.data()
      } as User;
    } else {
      // Create new user
      const newUser: Omit<User, 'uid'> = {
        phone: user.phoneNumber || '',
        name: `User_${user.phoneNumber?.slice(-4) || 'New'}`,
        isVerified: true,
        isAdmin: false,
        createdAt: new Date(),
        lastLogin: new Date(),
        addresses: [],
        preferences: {
          notifications: true,
          emailUpdates: true,
          language: 'en',
          currency: 'INR'
        }
      };

      await setDoc(doc(db, 'users', user.uid), {
        ...newUser,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      });

      return {
        uid: user.uid,
        ...newUser
      };
    }
  } catch (error: any) {
    console.error('Error verifying OTP:', error);
    throw new Error(error.message || 'Invalid OTP');
  }
};

// Sign out
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error('Error signing out:', error);
    throw new Error(error.message || 'Failed to sign out');
  }
};

// Get current user
export const getCurrentUser = (): FirebaseUser | null => {
  return auth.currentUser;
};

// Listen to auth state changes
export const onAuthStateChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Get user data from Firestore
export const getUserData = async (uid: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return {
        uid,
        ...userDoc.data()
      } as User;
    }
    return null;
  } catch (error: any) {
    console.error('Error getting user data:', error);
    throw new Error(error.message || 'Failed to get user data');
  }
};

// Update user data
export const updateUserData = async (uid: string, data: Partial<User>): Promise<void> => {
  try {
    await updateDoc(doc(db, 'users', uid), {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error: any) {
    console.error('Error updating user data:', error);
    throw new Error(error.message || 'Failed to update user data');
  }
};

// Get user by phone number
export const getUserByPhone = async (phone: string): Promise<User | null> => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('phone', '==', phone));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      return {
        uid: userDoc.id,
        ...userDoc.data()
      } as User;
    }
    return null;
  } catch (error: any) {
    console.error('Error getting user by phone:', error);
    throw new Error(error.message || 'Failed to get user by phone');
  }
};

// Add address to user
export const addUserAddress = async (uid: string, address: Address): Promise<void> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const addresses = userData.addresses || [];
      
      // If this is the first address, make it default
      if (addresses.length === 0) {
        address.isDefault = true;
      }
      
      addresses.push({
        ...address,
        id: Date.now().toString()
      });
      
      await updateDoc(doc(db, 'users', uid), {
        addresses,
        updatedAt: serverTimestamp()
      });
    }
  } catch (error: any) {
    console.error('Error adding address:', error);
    throw new Error(error.message || 'Failed to add address');
  }
};

// Update user preferences
export const updateUserPreferences = async (uid: string, preferences: Partial<UserPreferences>): Promise<void> => {
  try {
    await updateDoc(doc(db, 'users', uid), {
      preferences,
      updatedAt: serverTimestamp()
    });
  } catch (error: any) {
    console.error('Error updating preferences:', error);
    throw new Error(error.message || 'Failed to update preferences');
  }
};

// Check if user is admin
export const isUserAdmin = async (uid: string): Promise<boolean> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data().isAdmin || false;
    }
    return false;
  } catch (error: any) {
    console.error('Error checking admin status:', error);
    return false;
  }
};
