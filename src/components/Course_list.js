import Course from './Course'
import React, {useState} from 'react'

const Course_list = () => {
    const [course, setCourse] = useState([{title: "CS252 System Programming"}, {title: "CS307 Software Engineering"}])
  return (
    <div className="course_list">
      {course.map((course) => <Course title={course.title} />)}
    </div>
  )
}

export default Course_list
