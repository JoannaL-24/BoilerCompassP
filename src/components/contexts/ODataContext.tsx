import React, { ReactNode, useContext, useState, useEffect } from 'react'
import { firestore as db } from "models/firebase"
import { collection, getDocs } from "firebase/firestore";

type ODataContextProps = {
  children: ReactNode
}

type Courses = {
  CreditHours: number
  Description: string
  Id: string
  Number: string
  SubjectId: string
  Title: string
  // classes: Array<Class> | null
}

type ODataContextValue = {
  courses: Array<Courses>
}

const ODataContext = React.createContext<ODataContextValue | null>(null)

export const useOData = () => {
  return useContext(ODataContext)
}

export const ODataProvider: React.FC<ODataContextProps> = ({ children }) => {
  const [odataValue, setOData] = useState<ODataContextValue | null>(null)

  const coursesRef = collection(db, "courses")
  getDocs(coursesRef).then((querySnapshot) => {
    const courses: Array<Courses> = []
    querySnapshot.forEach((doc) => {
      courses.push(doc.data() as Courses)
    })
    setOData({ courses: courses })
  })

  return < ODataContext.Provider value={odataValue} > {children}</ODataContext.Provider >
}


