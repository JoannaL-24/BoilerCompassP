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
import dayjs from 'dayjs';
import { Box, FormControl } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Popup from "reactjs-popup";
import Button from "@material-ui/core/Button";
import { adjustSectionValue } from "@mui/x-date-pickers/internals/hooks/useField/useField.utils";


export default function ScheduleView({ name, id, semesterBlocks, setParentSemesterBlocks, completed, planned, total, viewOnly }) {
    const [semesterRender, setSemesterRender] = useState([]);
    const { currentUser } = useAuth();
    const hiddenFileInput = useRef(null);
    const navigate = useNavigate();
    const [userData, setUserData] = useState<UserData>(new LocalUserData)
    const remote = new RemoteUserdata();
    const [scheduleDate, setScheduleDate] = useState({
        startTerm: null,
        endTerm: null
    })
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [open, setOpen] = useState(false);
    const closeModal = () => setOpen(false);
    const year = dayjs().get('year');
    const validStartYear = (date) => !((year - date.get('year') >= 0) && (year - date.get('year') <= 10));
    const validEndYear = (date) => !((date.get('year') - year >= 0) && (date.get('year') - year <= 10));
    useEffect(() => {
        let newRender = [];
        for (var i = 0; i < semesterBlocks.length; i += 3) {
            newRender.push(
                <div key={i} className="Year">
                    <h3 style={{ padding: "150px 0px" }}>{semesterBlocks[i].year}<br />-<br />{semesterBlocks[i].year + 1}</h3>
                    <Semester key={i} semesterInfo={semesterBlocks[i]} viewOnly={viewOnly}/>
                    <Semester key={i + 1} semesterInfo={semesterBlocks[i + 1]} viewOnly={viewOnly}/>
                    <Semester key={i + 2} semesterInfo={semesterBlocks[i + 2]} viewOnly={viewOnly}/>
                </div>
            );
        }
        setSemesterRender(newRender);
    }, [semesterBlocks])

    useEffect(() => {
      if (currentUser)
        setUserData(remote)
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
    
    const editScheduleDate = () => {
        console.log(scheduleDate);
        let go = true;
        if (!scheduleDate.startTerm) {
            setStart("You must select a start date");
            go = false;
        }
        else setStart("");
        if (!scheduleDate.endTerm) {
            setEnd("You must select an end date");
            go = false;
        }
        if (!go) return;
        setParentSemesterBlocks(scheduleDate.startTerm, scheduleDate.endTerm);
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
                        <a className="DescrBtn" href=""><AddLinkIcon /></a>
                    </li>
                    <li>
                        <a className="DescrBtn" onClick={() => setOpen(o => !o)}><SettingsIcon /></a>
                        <Popup open={open} closeOnDocumentClick={false}>
                            <div className='popupModal' style={{ minHeight: "400px", padding: "3px 20px" }}>
                                <a className="close" onClick={closeModal}>
                                    &times;
                                </a>
                                <FormControl display="flex" style={{ width: 400 }}>
                                    <h3 className="Question">Your start date:</h3>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            sx={{ mt: "1em", mb: "2em" }}
                                            label="Select start year *"
                                            views={["year"]}
                                            shouldDisableYear={validStartYear}
                                            value={scheduleDate.startTerm}
                                            onChange={(value) => {
                                                setScheduleDate((previous) => ({ ...previous, startTerm: value }));
                                                setStart("");
                                            }}
                                            slotProps={{
                                                textField: {
                                                    error: start && start.length ? true : false,
                                                    helperText: start,
                                                },
                                            }}
                                        />
                                        <h3 className="Question">Your expected graduation date:</h3>
                                        <DatePicker
                                            sx={{ mt: "1em", mb: "2em" }}
                                            label="Select end year *"
                                            views={["year"]}
                                            shouldDisableYear={validEndYear}
                                            value={scheduleDate.endTerm}
                                            onChange={(value) => {
                                                setScheduleDate((previous) => ({ ...previous, endTerm: value }));
                                                setEnd("");
                                            }}
                                            slotProps={{
                                                textField: {
                                                    error: end && end.length ? true : false,
                                                    helperText: end,
                                                },
                                            }}
                                        />
                                    </LocalizationProvider>
                                </FormControl>
                                <Box className="Btn">
                                    <Button type="submit" onClick={editScheduleDate} variant="outlined">Edit</Button>
                                </Box>

                            </div>
                        </Popup>
                    </li>
                    <li>
                        <a className="DescrBtn" href=""><HelpOutlineIcon /></a>
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
