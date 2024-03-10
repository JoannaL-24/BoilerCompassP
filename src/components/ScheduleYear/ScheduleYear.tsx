import React from "react";
import "./ScheduleYear.css"
import Semester from "../Semester/Semester";

export default function ScheduleYear({startYear}) {

    let idBase = startYear * 10;
    return (
        <div className="Year">
            <h4>{startYear}<br/>-<br/>{startYear+1}</h4>
            <Semester term="Fall" dropId={idBase}/>
            <Semester term="Spring" dropId={idBase+1}/>
            <Semester term="Summer" dropId={idBase+2}/>
        </div>
    )
}