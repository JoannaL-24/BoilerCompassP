import React from "react";
import "./ScheduleYear.css"
import Semester from "../Semester/Semester";

export default function ScheduleYear() {

    return (
        <div className="Year">
            <h4>2022<br/>-<br/>2023</h4>
            <Semester/>
            <Semester/>
            <Semester/>
            
        </div>
    )
}