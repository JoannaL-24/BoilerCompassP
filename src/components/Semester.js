import React from 'react'
import Box from '@mui/system/Box';
import Course_list from './Course_list'

const Semester = () => {
  return (
    <div>
      <h1>Courses For Semester:</h1>
      <Course_list/>
      <h3>Total Credit:</h3>
    </div>
  )
}

export default Semester
