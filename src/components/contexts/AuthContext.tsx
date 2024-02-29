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
  updateUserEmail: (email: string) => Promise<void> | null,
  updateUserPassword: (password: string) => Promise<void> | null
}

const AuthContext = React.createContext<AuthContextValue | null>(null)

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

  const updateUserEmail = (email: string) => {
    if (currentUser) return updateEmail(currentUser, email)
    return null
  }

  const updateUserPassword = (password: string) => {
    if (currentUser) return updatePassword(currentUser, password)
    return null
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user)
        setCurrentUser(user)
    })

    return unsubscribe
  }, [])

  const value: AuthContextValue = {
    currentUser: currentUser,
    createUser,
    signUserIn,
    signUserOut,
    sendPassResetEmail,
    updateUserEmail,
    updateUserPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
