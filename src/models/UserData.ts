import { User } from "./BoilerCompass"

/*
 * Storage interface for user data retrieval and storage
 * i.e., Guest users' user data is stored in LocalStorage,
 * registered users' stored in Firebase, retrieved via LocalStorage.
 *
 * In general, fields of the user data should NEVER be deleted (i.e., set to undefined).
 * Instead, set to null, make empty for containers, etc.
 */
export default interface UserData {
  put(fieldName: string, data: any): Promise<void>
  get(fieldName: string): Promise<any>
  init(user: User): Promise<void>
  delete(): Promise<void>
}
