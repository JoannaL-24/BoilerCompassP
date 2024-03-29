import "./ScheduleView.css"
import "../Semester/Semester.css";
import React, { useEffect, useState } from "react";
import SettingsIcon from '@mui/icons-material/Settings';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AddLinkIcon from '@mui/icons-material/AddLink';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Semester from "../Semester/Semester";
import ProgressBar from '../ProgressBar'
import { getSatisfied } from '../models/BoilerCompass';
import { CS } from '../models/BoilerCompass'
import { useAuth } from "../components/contexts/AuthContext";
import RemoteUserdata from "../models/RemoteUserData";

export default function ScheduleView({ name, semesterBlocks, completed, planned, total }) {
    const [semesterRender, setSemesterRender] = useState([]);
    useEffect(() => {
        let newRender = [];
        for (var i = 0; i < semesterBlocks.length; i += 3) {
            newRender.push(
                <div key={i} className="Year">
                    <h3 style={{padding: "150px 0px"}}>{semesterBlocks[i].year}<br />-<br />{semesterBlocks[i].year + 1}</h3>
                    <Semester key={i} semesterInfo={semesterBlocks[i]}/>
                    <Semester key={i+1} semesterInfo={semesterBlocks[i+1]}/>
                    <Semester key={i+2} semesterInfo={semesterBlocks[i+2]}/>
                </div>
            );
        }
        setSemesterRender(newRender);
    }, [semesterBlocks])
    

    return (
        <div className="ScheduleView">
            <div className="ScheduleDestribtion">
                <h3>{name}</h3>
                <ul>
                    <li>
                        <a className="DescrBtn" href="1"><FileUploadIcon /></a>
                    </li>
                    <li>
                        <a className="DescrBtn" href="1"><FileDownloadIcon /></a>
                    </li>
                    <li>
                        <a className="DescrBtn" href="1"><AddLinkIcon /></a>
                    </li>
                    <li>
                        <a className="DescrBtn" href="1"><SettingsIcon /></a>
                    </li>
                    <li>
                        <a className="DescrBtn" href="1"><HelpOutlineIcon /></a>
                    </li>
                </ul>
            </div>
            <ProgressBar completed={completed} planned={planned} total={total} />
            <div className="SemesterYears">
                {semesterRender}
            </div>
        </div>
    )
}