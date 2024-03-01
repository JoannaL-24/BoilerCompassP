import React from "react";
import Draggable from "react-draggable";
import Card from "@mui/material/Card";
import "./Semester.css"

const Semester = ({term}) => {

    return (
        <div className="Semester">
            <div className="SemesterDescription">
                <h3>{term} (16 Hrs) </h3>
            </div>
            <div className="Courses">
            {/* <Draggable>
                <Card
                    style={{
                    width: "150px",
                    height: "100px",
                    }}
                />
           </Draggable> */}
            </div>
        </div>
    )
}
export default Semester