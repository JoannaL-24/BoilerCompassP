import UserData from './UserData'
import { User, Student, Advisor } from './BoilerCompass'
const tmpS: Student = {
  prefer_majors: [],
  prefer_minor: [],
  start_term: undefined,
  end_term: undefined,
  advisors: [],
  groups: [],
  name: '',
  purdue_email: '',
  dark_mode: false,
  completed_courses: [],
  course_grades: new Map(),
}
const tmpA: Advisor = {
  department: '',
  office: '',
  students: [],
  name: '',
  purdue_email: '',
  dark_mode: false,
  groups: [],
}
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

  init(user: User): Promise<void> {
    Object.keys(user).forEach((key) => {
      this.put(key, user[key])
    })
    return Promise.resolve()
  }

  delete(): Promise<void> {
    Object.keys(tmpS).forEach((key) => {
      window.localStorage.removeItem(key)
    })
    Object.keys(tmpA).forEach((key) => {
      window.localStorage.removeItem(key)
    })
    return Promise.resolve()
  }

  exportAndDownload(): void {
    let data = {}
    Object.keys(tmpS).forEach((key) => {
      let val = window.localStorage.getItem(key)
      if (val != null) data[key] = val
    })
    Object.keys(tmpA).forEach((key) => {
      let val = window.localStorage.getItem(key)
      if (val != null) data[key] = val
    })

    const dataBlob = new Blob([JSON.stringify(data)], {
      type: 'application/json',
    })
    const a = document.createElement('a')
    const url = URL.createObjectURL(dataBlob)
    a.href = url
    a.download = 'BCDataExport.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  import(data: Blob): void {
    const freader = new FileReader()
    freader.onload = (event) => {
      let dataObj = JSON.parse(event.target?.result as string)
      Object.entries(dataObj).forEach(([key, val]) => {
        localStorage.setItem(key, val as string)
      })
    }

    freader.readAsText(data)
  }
}
