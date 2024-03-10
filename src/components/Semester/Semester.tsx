import React from "react";
import { Droppable } from "react-beautiful-dnd";
import Card from "@mui/material/Card";
import "./Semester.css"

const Semester = ({ term, dropId }) => {
    return (
        <div className="Semester">
            <div className="SemesterDescription">
                <h3>{term} (16 Hrs) </h3>
            </div>
            <Droppable droppableId={dropId}>
                {(provided) => (
                    <div className="Courses" {...provided.droppableProps} ref={provided.innerRef}>
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>

        </div>
    )
}
export default Semester