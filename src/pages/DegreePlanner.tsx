import React, { useState } from "react";
import NavBar from "../components/NavBar/NavBar";
import ScheduleView from "../components/ScheduleView/ScheduleView";
import SceduleSide from "../components/ScheduleSide/ScheduleSide";
import './DegreePlanner.css';

export default function DegreePlanner () {

    return(
        <div className="DegreeOverview">
            <NavBar/>
            <div className="DegreeContent">
                <ScheduleView/>
                <SceduleSide/>
            </div>
            
        </div>
    )
}