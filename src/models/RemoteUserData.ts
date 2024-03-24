import UserData from './UserData'

import { firestore } from './firebase'
import {
  doc,
  getDocFromCache,
  getDocFromServer,
  updateDoc,
  deleteDoc,
  setDoc,
} from 'firebase/firestore'
import { User as AuthUser } from 'firebase/auth'
import { useAuth } from '../components/contexts/AuthContext'
import { User } from './BoilerCompass'

export default class RemoteUserdata implements UserData {
  currentUser: AuthUser

  constructor() {
    this.currentUser = useAuth().currentUser
  }

  put(fieldName: string, data: any): Promise<void> {
    const uid = this.currentUser?.uid
    if (!uid)
      return Promise.reject('currentUser is null, cannot access remote data')

    return new Promise((resolve, reject) => {
      updateDoc(doc(firestore, `/users/${uid}/`), fieldName, data)
        .then(() => resolve())
        .catch((error) => reject(error))
    })
  }

  get(fieldName: string): Promise<any> {
    const uid = this.currentUser?.uid
    if (!uid)
      return Promise.reject('currentUser is null, cannot access remote data')

    return new Promise((resolve, reject) => {
      const docRef = doc(firestore, `/users/${uid}/`)
      getDocFromCache(docRef)
        .then((snapshot) => {
          if (snapshot.exists()) resolve(snapshot.get(fieldName))
          else {
            getDocFromServer(docRef)
              .then((snapshot) => {
                if (snapshot.exists()) resolve(snapshot.get(fieldName))
                else reject('Document does not exist')
              })
              .catch((err) => reject(err))
          }
        })
        .catch(() => {
          getDocFromServer(docRef)
            .then((snapshot) => {
              if (snapshot.exists()) resolve(snapshot.get(fieldName))
              else reject('Document does not exist')
            })
            .catch((err) => reject(err))
        })
    })
  }

  getAll(): Promise<any> {
    const uid = this.currentUser?.uid
    if (!uid)
      return Promise.reject('currentUser is null, cannot access remote data')

    return new Promise((resolve, reject) => {
      const docRef = doc(firestore, `/users/${uid}/`)
      getDocFromCache(docRef)
        .then((snapshot) => {
          if (snapshot.exists()) resolve(snapshot.data())
          else {
            getDocFromServer(docRef)
              .then((snapshot) => {
                if (snapshot.exists()) resolve(snapshot.data())
                else reject('Document does not exist')
              })
              .catch((err) => reject(err))
          }
        })
        .catch(() => {
          getDocFromServer(docRef)
            .then((snapshot) => {
              if (snapshot.exists()) resolve(snapshot.data())
              else reject('Document does not exist')
            })
            .catch((err) => reject(err))
        })
    })
  }

  init(user: User): Promise<void> {
    const uid = this.currentUser?.uid
    if (!uid)
      return Promise.reject('currentUser is null, cannot initialize a new User')
    return new Promise((resolve, reject) => {
      setDoc(doc(firestore, `/users/${uid}/`), user)
        .then(() => resolve())
        .catch((error) => reject(error))
    })
  }

  delete(): Promise<void> {
    const uid = this.currentUser?.uid
    if (!uid)
      return Promise.reject('currentUser is null, cannot delete remote data')
    return new Promise((resolve, reject) => {
      deleteDoc(doc(firestore, `/users/${uid}/`))
        .then(() => resolve())
        .catch((error) => reject(error))
    })
  }
}
