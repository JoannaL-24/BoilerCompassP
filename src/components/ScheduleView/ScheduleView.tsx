import "./ScheduleView.css"
import React, { useState } from "react";
import SettingsIcon from '@mui/icons-material/Settings';


export default function ScheduleView () {
    return (
        <div className="ScheduleView">         
            <div className="ScheduleDestribtion">
                <h3>Schedule Name :)</h3>
                <ul>
                    <li>
                        <a className="DescrBtn" href="1"><SettingsIcon/></a>
                    </li>
                </ul>
                
            </div>
        </div>
    )
}