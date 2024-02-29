import React, {useState} from 'react'
import Box from '@mui/system/Box';
import Course_list from './CourseList'

const Semester = (props) => {
  const [semester, setSemester] = useState([{no: "1"}, {no: "2"}, {no: "3"}, {no: "4"}, {no: "5"}, {no: "6"}, {no: "7"}, {no: "8"}])
  return (
    <div>
      <h2>Semester {props.no}</h2>
      <Course_list/>
      <h3>Total Credit:</h3>
    </div>
  )
}

export default Semester
