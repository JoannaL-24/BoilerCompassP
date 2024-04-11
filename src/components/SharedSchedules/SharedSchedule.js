import React, { useState, useEffect } from "react";
import Popup from 'reactjs-popup';
import Button from '@mui/material/Button';
import { doc, getDoc, collection } from "firebase/firestore";
import { firestore } from '../../models/firebase.ts';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { getSatisfied } from '../../models/BoilerCompass';
import { CS } from '../../models/CS';
import "../CoursePopup/CoursePopup.css";

const SharedSchedule = ({setViewOnly, setFriendSchedule}) => {
  const [userID, setuserID] = useState("Dfo2QJCOGIbYNtgxH4A2vib3fXB2"); // this will be passed in
  const [openScheduleList, setOpenScheduleList] = useState(false);
  const [scheduleList, setscheduleList] = useState([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const user_doc = getDoc(doc(firestore, "users", userID))
          .then((docSnapshot) => {
            console.log
            let scheduleNames = docSnapshot.data().schedule;
            for (let s of scheduleNames) {
              console.log(s);
              const schedule_doc = getDoc(doc(firestore, "schedules", s))
                .then((scheduleSnapshot) => {
                  let schedule = scheduleSnapshot.data();
                  schedule = {...schedule, ID: s};
                  setscheduleList([ ...scheduleList, schedule]);
                })
                .catch((error) => {
                  console.log(error);
                })
            }
          });
    setDone(true);
  }, [])

  console.log(scheduleList);

  const handleClick = (schedule) => {
    let c = getSatisfied(CS, new Set(schedule.completed_courses));
    schedule = {...schedule, completed: c[0], total: c[1]};
    c = getSatisfied(CS, new Set(schedule.planned_courses));
    schedule = {...schedule, planned: c[0]};
    // setViewOnly(true);
    // setFriendSchedule(schedule);
    console.log(schedule);
  }

  return (
    <div>
      <Button type="submit" onClick={()=>{setOpenScheduleList(true)}} variant="outlined">TEST</Button>
      {done &&
        <Popup
          open={openScheduleList}
          modal
          nested
          >
            {() => (
              <div className='popupModal'>
                <button className='close' onClick={()=>setOpenScheduleList(false)}>
                  &times;
                </button>
                <div className='header'>Schedules</div>
                <Box sx={{ width: '100%', maxWidth: 300 }} >
                  <List>
                    {scheduleList.map((s) => (
                      <ListItem disablePadding key={s.ID}>
                        <ListItemButton onClick={()=>{handleClick(s)}}>
                          <ListItemText primary={s.name} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </div>
            )}
        </Popup>
      }
    </div>
  )
}

export default SharedSchedule
