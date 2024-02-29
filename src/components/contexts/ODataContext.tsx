import React, { ReactNode, useContext, useState, useEffect } from 'react'
import { firestore as db } from "models/firebase"
import { collection, getDocs, getDoc } from "firebase/firestore";

type ODataContextProps = {
  children: ReactNode
}

type Course = {
  CreditHours: number
  Description: string
  Id: string
  Number: string
  SubjectId: string
  Title: string
  // classes: Array<Class> | null
}

type CourseName = {
  Name: string
  Id: string
}

type ODataContextValue = {
  // courses: Array<Course>
  // courseNames: Array<CourseName>
}

const ODataContext = React.createContext<ODataContextValue | null>(null)

export const useOData = () => {
  return useContext(ODataContext)
}

export const ODataProvider: React.FC<ODataContextProps> = ({ children }) => {

  const [odataValue, setOData] = useState<ODataContextValue | null>(null)

  if (!odataValue) {
  }

  return < ODataContext.Provider value={odataValue} > {children}</ODataContext.Provider >
}


