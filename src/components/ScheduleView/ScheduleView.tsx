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

export default function ScheduleView({ semesterBlocks }) {
    const [semesterRender, setSemesterRender] = useState([]);
    useEffect(() => {
        let newRender = [];
        for (var i = 0; i < semesterBlocks.length; i += 3) {
            newRender.push(
                <div key={i} className="Year">
                    <h4>{semesterBlocks[i].year}<br />-<br />{semesterBlocks[i].year + 1}</h4>
                    {
                        semesterBlocks.slice(i, i + 3)
                            .map(semester => (
                                <Semester key={semester.id} semesterInfo={semester}/>
                            ))
                    }
                </div>
            );
        }
        setSemesterRender(newRender);
    }, [semesterBlocks])

    return (
        <div className="ScheduleView">
            <div className="ScheduleDestribtion">
                <h3>Schedule Name :)</h3>
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
            <ProgressBar completed={20} total={50} planned={40} />
            <div className="SemesterYears">
                {semesterRender}
            </div>
        </div>
    )
}