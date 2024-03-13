import "./ScheduleView.css"
import React, { useState } from "react";
import SettingsIcon from '@mui/icons-material/Settings';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AddLinkIcon from '@mui/icons-material/AddLink';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ScheduleYear from "../ScheduleYear/ScheduleYear";
import ProgressBar from '../ProgressBar'

export default function ScheduleView () {

    return (
        <div className="ScheduleView">         
            <div className="ScheduleDestribtion">
                <h3>Schedule Name :)</h3>
                <ul>
                    <li>
                        <a className="DescrBtn" href="1"><FileUploadIcon/></a>
                    </li>
                    <li>
                        <a className="DescrBtn" href="1"><FileDownloadIcon/></a>
                    </li>
                    <li>
                        <a className="DescrBtn" href="1"><AddLinkIcon/></a>
                    </li>
                    <li>
                        <a className="DescrBtn" href="1"><SettingsIcon/></a>
                    </li>
                    <li>
                        <a className="DescrBtn" href="1"><HelpOutlineIcon/></a>
                    </li>
                </ul>
            </div>
            <ProgressBar completed={20} total={50} planned={40}/>
            <div className="SemesterYears">
                <ScheduleYear startYear={2022} idBase={1}/>
                <ScheduleYear startYear={2023} idBase={4}/>
                <ScheduleYear startYear={2024} idBase={7}/>
                <ScheduleYear startYear={2025} idBase={10}/>
            </div>
        </div>
    )
}