import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from 'firebase/auth'
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'
import { getCurrentDomain } from '../config/environment'

interface AuthUser {
  uid: string
  email?: string
  phone?: string
  name: string
  isVerified: boolean
  isAdmin: boolean
  createdAt: Date
  lastLogin: Date
  addresses: any[]
  preferences: {
    notifications: boolean
    emailUpdates: boolean
    language: string
    currency: string
  }
}

interface AuthContextType {
  user: AuthUser | null
  session: Session | null
  loading: boolean
  // Email/Password authentication
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<void>
  // Phone OTP authentication
  sendOTP: (phone: string) => Promise<void>
  verifyOTP: (phone: string, otp: string) => Promise<void>
  // Social authentication
  signInWithGoogle: () => Promise<void>
  // Sign out
  signOut: () => Promise<void>
  // Auth provider
  authProvider: 'firebase' | 'supabase'
  setAuthProvider: (provider: 'firebase' | 'supabase') => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [authProvider, setAuthProvider] = useState<'firebase' | 'supabase'>('firebase')

  useEffect(() => {
    if (authProvider === 'supabase') {
      // Supabase auth listener
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session)
        if (session?.user) {
          setUser({
            uid: session.user.id,
            email: session.user.email || undefined,
            name: session.user.user_metadata?.full_name || 'User',
            isVerified: session.user.email_confirmed_at ? true : false,
            isAdmin: false, // You can check this from your database
            createdAt: new Date(session.user.created_at),
            lastLogin: new Date(),
            addresses: [],
            preferences: {
              notifications: true,
              emailUpdates: true,
              language: 'en',
              currency: 'INR'
            }
          })
        } else {
          setUser(null)
        }
        setLoading(false)
      })

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
        if (session?.user) {
          setUser({
            uid: session.user.id,
            email: session.user.email || undefined,
            name: session.user.user_metadata?.full_name || 'User',
            isVerified: session.user.email_confirmed_at ? true : false,
            isAdmin: false,
            createdAt: new Date(session.user.created_at),
            lastLogin: new Date(),
            addresses: [],
            preferences: {
              notifications: true,
              emailUpdates: true,
              language: 'en',
              currency: 'INR'
            }
          })
        } else {
          setUser(null)
        }
        setLoading(false)
      })

      return () => subscription.unsubscribe()
    } else {
      // Firebase auth listener
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          // Check if user exists in Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
          
          if (userDoc.exists()) {
            const userData = userDoc.data()
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email || undefined,
              phone: firebaseUser.phoneNumber || undefined,
              name: userData.name,
              isVerified: userData.isVerified,
              isAdmin: userData.isAdmin,
              createdAt: userData.createdAt.toDate(),
              lastLogin: userData.lastLogin.toDate(),
              addresses: userData.addresses || [],
              preferences: userData.preferences || {
                notifications: true,
                emailUpdates: true,
                language: 'en',
                currency: 'INR'
              }
            })
          } else {
            // Create new user in Firestore
            const newUser = {
              email: firebaseUser.email || '',
              phone: firebaseUser.phoneNumber || '',
              name: firebaseUser.displayName || `User_${firebaseUser.uid.slice(-4)}`,
              isVerified: firebaseUser.emailVerified,
              isAdmin: false,
              createdAt: serverTimestamp(),
              lastLogin: serverTimestamp(),
              addresses: [],
              preferences: {
                notifications: true,
                emailUpdates: true,
                language: 'en',
                currency: 'INR'
              }
            }
            
            await setDoc(doc(db, 'users', firebaseUser.uid), newUser)
            
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email || undefined,
              phone: firebaseUser.phoneNumber || undefined,
              name: newUser.name,
              isVerified: newUser.isVerified,
              isAdmin: newUser.isAdmin,
              createdAt: new Date(),
              lastLogin: new Date(),
              addresses: newUser.addresses,
              preferences: newUser.preferences
            })
          }
        } else {
          setUser(null)
        }
        setLoading(false)
      })

      return () => unsubscribe()
    }
  }, [authProvider])

  // Email/Password authentication
  const signInWithEmail = async (email: string, password: string) => {
    if (authProvider === 'supabase') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
    } else {
      await signInWithEmailAndPassword(auth, email, password)
      // User will be set by the auth state listener
    }
  }

  const signUpWithEmail = async (email: string, password: string, fullName: string) => {
    if (authProvider === 'supabase') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })
      if (error) throw error
    } else {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      // Update user profile
      await setDoc(doc(db, 'users', result.user.uid), {
        email,
        name: fullName,
        isVerified: false,
        isAdmin: false,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        addresses: [],
        preferences: {
          notifications: true,
          emailUpdates: true,
          language: 'en',
          currency: 'INR'
        }
      })
    }
  }

  // Phone OTP authentication
  const sendOTP = async (phone: string) => {
    if (authProvider === 'firebase') {
      // Initialize reCAPTCHA
      if (!(window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          'size': 'invisible',
          'callback': () => {
            // reCAPTCHA solved
          }
        })
      }

      const confirmationResult = await signInWithPhoneNumber(
        auth, 
        phone, 
        (window as any).recaptchaVerifier
      )
      ;(window as any).confirmationResult = confirmationResult
    } else {
      // For Supabase, you would implement phone auth here
      throw new Error('Phone authentication not implemented for Supabase yet')
    }
  }

  const verifyOTP = async (phone: string, otp: string) => {
    if (authProvider === 'firebase') {
      const confirmationResult = (window as any).confirmationResult
      if (!confirmationResult) {
        throw new Error('No OTP confirmation found. Please request OTP again.')
      }

      const result = await confirmationResult.confirm(otp)
      const firebaseUser = result.user

      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
      
      if (userDoc.exists()) {
        // Update last login
        await updateDoc(doc(db, 'users', firebaseUser.uid), {
          lastLogin: serverTimestamp()
        })
      } else {
        // Create new user
        const newUser = {
          phone: firebaseUser.phoneNumber || '',
          name: `User_${firebaseUser.phoneNumber?.slice(-4) || 'New'}`,
          isVerified: true,
          isAdmin: false,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          addresses: [],
          preferences: {
            notifications: true,
            emailUpdates: true,
            language: 'en',
            currency: 'INR'
          }
        }

        await setDoc(doc(db, 'users', firebaseUser.uid), newUser)
      }
    } else {
      throw new Error('Phone authentication not implemented for Supabase yet')
    }
  }

  // Social authentication
  const signInWithGoogle = async () => {
    if (authProvider === 'supabase') {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: getCurrentDomain(),
        },
      })
      if (error) throw error
    } else {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
    }
  }

  // Sign out
  const signOut = async () => {
    if (authProvider === 'supabase') {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } else {
      await firebaseSignOut(auth)
    }
    setUser(null)
  }

  const value = {
    user,
    session,
    loading,
    signInWithEmail,
    signUpWithEmail,
    sendOTP,
    verifyOTP,
    signInWithGoogle,
    signOut,
    authProvider,
    setAuthProvider,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
