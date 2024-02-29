import { useState } from 'react';
import data from "./CourseTest.json";

function SearchList(props) {
  // const oDataContext = useOData();
  // console.log(oDataContext?.courses)

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
