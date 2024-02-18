import React from 'react'
import '../CSS_files/Course.css'

const Course = (props) => {
  return (
    <div className='course'>
        <div className='number_name'>{props.title}</div>
    </div>
  )
}

export default Course
