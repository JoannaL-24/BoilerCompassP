import { React, useState } from 'react'
import { useOData } from './contexts/ODataContext'
import data from "./CourseTest.json"
import { doc, getDoc } from "firebase/firestore";
import { firestore as db } from "models/firebase"

function SearchList(props) {
  const oDataContext = useOData();
  // console.log(oDataContext?.courseNames)
  // console.log(oDataContext?.courseIds)

  if (oDataContext) {
    const docRef = doc(db, "courses", oDataContext?.courseNames[0].Id);
    getDoc(docRef).then((doc) => {
      console.log("Document data:", doc.data());
    })
  }

  //create a new array by filtering the original array
  const filteredData = data.filter((el) => {
    //if no input the return the original
    if (props.input === '') {
      return el;
    }
    //return the item which contains the user input
    else {
      return el.name.toLowerCase().includes(props.input)
    }
  })
  return (
    <ul>
      {filteredData.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </ul>
  )
}

export default SearchList
