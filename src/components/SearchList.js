import { React, useState } from 'react'
import { useOData } from './contexts/ODataContext'
import data from "./CourseTest.json"
import { doc, getDoc } from "firebase/firestore";
import { firestore as db } from "models/firebase"

function SearchList(props) {
  // if (oDataContext) {
  //   const docRef = doc(db, "courses", oDataContext?.courseNames[0].Id);
  //   getDoc(docRef).then((doc) => {
      // console.log("Document data:", doc.data());
  //   })
  // }

  return (
    <ul>
      {data.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </ul>
  )
}

export default SearchList
