import React from "react";
import Draggable from "react-draggable";
import Card from "@mui/material/Card";
import "./Semester.css"

const Semester = ({term}) => {
    let credits = 0;
    
    return (
        <div className="Semester">
            <div className="SemesterDescription">
                <h3>{term} ({credits} Hrs) </h3>
            </div>
            <div className="Courses">
            <Draggable>
                <Card
                    style={{
                    width: "150px",
                    height: "100px",
                    }}
                />
           </Draggable>
            </div>
        </div>
    )
}
export default Semester