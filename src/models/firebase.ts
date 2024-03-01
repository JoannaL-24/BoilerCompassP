import { initializeApp } from 'firebase/app'
import { getAuth, User } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
const app = initializeApp({
  apiKey: `${process.env.REACT_APP_FIREBASE_KEY}`,
  authDomain: `${process.env.REACT_APP_FIREBASE_AUTH_DOMAIN}`,
  projectId: `${process.env.REACT_APP_FIREBASE_PROJECT_ID}`,
  storageBucket: `${process.env.REACT_APP_FIREBASE_STORAGE_BUCKET}`,
  messagingSenderId: `${process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID}`,
  appId: `${process.env.REACT_FIREBASE_APP_ID}`,
  measurementId: `${process.env.REACT_FIREBASE_MEASUREMENT_ID}`,
})

export const firestore = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)
export const uploadUserPfp = async (picture: Blob, user: User) => {
  const pfpRef = ref(storage, `${user.uid}.png`)
  return await uploadBytes(pfpRef, picture)
}
export const getUserPfpURL = async (user: User) => {
  const pfpRef = ref(storage, `${user.uid}.png`)
  return await getDownloadURL(pfpRef)
}
export default app
