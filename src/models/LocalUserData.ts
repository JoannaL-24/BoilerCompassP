import UserData from './UserData'

// Local storage implementation for user data storage and retrieval
export default class LocalUserData implements UserData {
  /* Returns whether the data was stored successfully.
   * setItem can throw a DOMException: QuotaExceededError.
   */
  put(fieldName: string, data: unknown): Promise<void> {
    try {
      window.localStorage.setItem(fieldName, JSON.stringify(data))
    } catch (e: unknown) {
      console.log(e)
      return Promise.reject(e)
    }
    return Promise.resolve()
  }

  /* Returns the value stored as an object of unknown type,
   * or undefined for a field not defined.
   */
  get(fieldName: string): Promise<unknown> {
    const data = window.localStorage.getItem(fieldName)
    if (data === undefined) return Promise.resolve(undefined)
    if (data === null) return Promise.resolve(null)
    return Promise.resolve(JSON.parse(data))
  }
}
