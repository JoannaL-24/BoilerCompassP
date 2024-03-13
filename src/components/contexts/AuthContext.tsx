import React, { ReactNode, useContext, useState, useEffect } from 'react'
import { auth } from '../../models/firebase'
import {
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  updateEmail,
  updatePassword,
} from 'firebase/auth'

type AuthContextProps = {
  children: ReactNode
}

type AuthContextValue = {
  currentUser: User | null
  createUser: (email: string, password: string) => Promise<UserCredential>
  signUserIn: (email: string, password: string) => Promise<UserCredential>
  signUserOut: () => Promise<void>
  sendPassResetEmail: (email: string) => Promise<void>
  updateUserEmail: (currentUser: User, email: string) => Promise<void> | null
  updateUserPassword: (
    currentUser: User,
    password: string,
  ) => Promise<void> | null
}

const createUser = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password)
}

const signUserIn = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password)
}

const signUserOut = () => {
  return signOut(auth)
}

const sendPassResetEmail = (email: string) => {
  return sendPasswordResetEmail(auth, email)
}

const updateUserEmail = (currentUser: User, email: string) => {
  return updateEmail(currentUser, email)
}

const updateUserPassword = (currentUser: User, password: string) => {
  return updatePassword(currentUser, password)
}

const value: AuthContextValue = {
  currentUser: null,
  createUser,
  signUserIn,
  signUserOut,
  sendPassResetEmail,
  updateUserEmail,
  updateUserPassword,
}

const AuthContext = React.createContext<AuthContextValue>(value)

export const useAuth = () => {
  return useContext(AuthContext)
}

/* Global provider for authentication functions and the currentUser variable.
 * Anywhere authentication is needed in a child of an AuthProvider,
 * call useAuth and assign the props needed.
 * @example
 * const { currentUser, createUser, signUserIn } = useAuth()
 */
export const AuthProvider: React.FC<AuthContextProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    })

    return unsubscribe
  }, [])

  return (
    <AuthContext.Provider value={{ ...value, currentUser: currentUser }}>
      {children}
    </AuthContext.Provider>
  )
}
