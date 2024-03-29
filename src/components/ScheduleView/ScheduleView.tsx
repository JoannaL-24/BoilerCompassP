import "./ScheduleView.css"
import "../Semester/Semester.css";
import React, { useEffect, useRef, useState } from "react";
import SettingsIcon from '@mui/icons-material/Settings';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AddLinkIcon from '@mui/icons-material/AddLink';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Semester from "../Semester/Semester";
import ProgressBar from '../ProgressBar'
import { useAuth } from "../contexts/AuthContext";
import UserData from "models/UserData";
import LocalUserData from "models/LocalUserData";
import RemoteUserdata from "models/RemoteUserData";
import { useNavigate } from "react-router-dom";

export default function ScheduleView({ name, semesterBlocks, completed, planned, total }) {
    const [semesterRender, setSemesterRender] = useState([]);
    const { currentUser } = useAuth();
    const hiddenFileInput = useRef(null);
    const navigate = useNavigate();
    const [userData, setUserData] = useState<UserData>(new LocalUserData)

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

    useEffect(() => {
      if (currentUser)
        setUserData(new RemoteUserdata)
    }, [currentUser])

  const handleClickImport = (e) => {
    hiddenFileInput.current.click();
  }

  const handleClickExport = (e) => {
    (userData as LocalUserData).exportAndDownload()
  }

  const handleChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    (userData as LocalUserData).import(file)
    navigate(0);
  }
    

    return (
        <div className="ScheduleView">
            <div className="ScheduleDestribtion">
                <h3>{name}</h3>
                <ul>
                    {
                      !currentUser ? <>
                      <li>
                          <a className="DescrBtn" onClick={handleClickImport}
                            style={{cursor: 'pointer'}}><FileUploadIcon /></a>
                      </li>
                      <input
                        type="file"
                        ref={hiddenFileInput}
                        onChange={handleChange}
                        style={{display: 'none'}}
                      />
                      <li>
                          <a className="DescrBtn" onClick={handleClickExport}
                            style={{cursor: 'pointer'}}><FileDownloadIcon /></a>
                      </li>
                      </> : <></>
                    }
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
