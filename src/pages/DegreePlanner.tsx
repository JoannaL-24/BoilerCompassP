import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar/NavBar";
import ScheduleView from "../components/ScheduleView/ScheduleView";
import SceduleSide from "../components/ScheduleSide/ScheduleSide";
import './DegreePlanner.css';
// firebase imports
import { useAuth } from '../components/contexts/AuthContext.tsx'
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { firestore } from '../models/firebase.ts';

// sidebar import
import "../components/ScheduleSide/ScheduleSide.css";
import Searchbar from "components/Searchbar.js";
// search bar input
import "../components/Searchbar.css";
//view
import "../components/ScheduleView/ScheduleView.css"
import SettingsIcon from '@mui/icons-material/Settings';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AddLinkIcon from '@mui/icons-material/AddLink';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ScheduleYear from "../components/ScheduleYear/ScheduleYear";
import ProgressBar from '../components/ProgressBar'


export default function DegreePlanner() {
    //get current user and mode preference
    const { currentUser } = useAuth();
    const [darkmode, setDarkmode] = useState<boolean>(null);

    useEffect(() => {
        if (currentUser) {
            const user_doc = getDoc(doc(firestore, "users", currentUser.uid))
                .then((docSnapshot) => {
                    setDarkmode(docSnapshot.data().dark_mode);
                });
        }
    }, [currentUser]);

    return (
        <div className="DegreeOverview">
            <NavBar
                darkmode={darkmode}
                setDarkmode={setDarkmode} />
            <div className="DegreeContent">
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
                        <ScheduleYear startYear={2022} />
                        <ScheduleYear startYear={2023} />
                        <ScheduleYear startYear={2024} />
                        <ScheduleYear startYear={2025} />
                    </div>
                    {/* create seperate component for semester */}

                </div>
                <div className="ScheduleSide">
                    <button className="mediumBtn goldBtn"><h3>Requirement</h3></button>
                    <Searchbar />
                </div>
            </div>

        </div>
    )
}