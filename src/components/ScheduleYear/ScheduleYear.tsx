import React from "react";
import "./ScheduleYear.css"
import Semester from "../Semester/Semester";

export default function ScheduleYear({startYear}) {

    return (
        <div className="Year">
            
            <h4>{startYear}<br/>-<br/>{startYear+1}</h4>
            <Semester term="Fall"/>
            <Semester term="Spring"/>
            <Semester term="Summer"/>
        </div>
    )
}