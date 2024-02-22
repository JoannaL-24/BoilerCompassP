import React from 'react'
import '../CSS_files/Course.css'

const Course = (props) => {
  return (
    <div className='course'>
        <h3 className='number_name'>{props.title}</h3>
    </div>
  )
}

export default Course
