import Course from './Course'
import React, {useState} from 'react'

const CourseList = () => {
    const [course, setCourse] = useState([{title: "CS252 System Programming"}, {title: "CS307 Software Engineering"}])
  return (
    <div className="courseList">
      {course.map((course) => <Course title={course.title} />)}
    </div>
  )
}

export default CourseList
