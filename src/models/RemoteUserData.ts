import UserData from './UserData'

import { firestore } from './firebase'
import {
  DocumentReference,
  doc,
  getDocFromCache,
  getDocFromServer,
  getDoc,
  updateDoc,
} from 'firebase/firestore'
import { useAuth } from '../components/contexts/AuthContext'

export default class RemoteUserdata implements UserData {
  put(fieldName: string, data: any): Promise<void> {
    const uid = useAuth()?.currentUser?.uid
    if (!uid)
      return Promise.reject('currentUser is null, cannot access remote data')

    return new Promise((resolve, reject) => {
      updateDoc(doc(firestore, `/users/${uid}/`), fieldName, data)
        .then(() => resolve())
        .catch((error) => reject(error))
    })
  }

  get(fieldName: string): Promise<any> {
    const uid = useAuth()?.currentUser?.uid
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
}
