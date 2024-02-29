import UserData from './UserData'

// Local storage implementation for user data storage and retrieval
export default class LocalUserData implements UserData {
  /* Returns whether the data was stored successfully.
   * setItem can throw a DOMException: QuotaExceededError.
   */
  put(fieldName: string, data: unknown): boolean {
    try {
      window.localStorage.setItem(fieldName, JSON.stringify(data))
    } catch (e: unknown) {
      console.log(e)
      return false
    }
    return true
  }

  /* Returns the value stored as an object of unknown type,
   * or undefined for a field not defined.
   */
  get(fieldName: string): unknown {
    const data = window.localStorage.getItem(fieldName)
    if (data === undefined) return undefined
    if (data === null) return null

    return JSON.parse(data)
  }
}
