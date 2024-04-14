import React from "react";
import { Droppable } from "react-beautiful-dnd";
import DraggableCourse from "components/DraggableCourse/DraggableCourse";
import "./Semester.css"


const Semester = ({ semesterInfo, viewOnly }) => {
    return (
        <div className="Semester">
            <div className="SemesterDescription">
                <h3>{semesterInfo.term} ({semesterInfo.credit} Hrs) </h3>
            </div>
            <Droppable droppableId={semesterInfo.id+""}>
                {(provided) => (
                    <div className="Courses" {...provided.droppableProps} ref={provided.innerRef}>
                        {semesterInfo.course_list.map((course, index) => (
                            <DraggableCourse 
                                key={index} 
                                index={index}
                                course={course.course}
                                id={course.id}
                                description={course.description}
                                credit={course.credit} 
                                classId={course.classId} 
                                viewOnly={viewOnly}
                            />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>

        </div>
    )
}
export default Semester