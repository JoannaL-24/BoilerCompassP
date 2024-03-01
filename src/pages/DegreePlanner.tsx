import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar/NavBar";
import ScheduleView from "../components/ScheduleView/ScheduleView";
import SceduleSide from "../components/ScheduleSide/ScheduleSide";
import './DegreePlanner.css';
// firebase imports
import { useAuth } from '../components/contexts/AuthContext.tsx'
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { firestore } from '../models/firebase.ts';

export default function DegreePlanner () {
    //get current user and mode preference
    const { currentUser } = useAuth();
    const [darkmode, setDarkmode] = useState<boolean>(true);

    // console.log(setDark_mode)
    console.log(darkmode)

    useEffect(() => {                           
        if (currentUser) {

        const user_doc = getDoc(doc(firestore, "users", currentUser.uid))
        .then((docSnapshot) => {
            setDarkmode(docSnapshot.data().dark_mode);
        });
        }
    }, [currentUser]);

    return(
        <div className="DegreeOverview">
            <NavBar
                darkmode = {darkmode}
                setDarkmode = {setDarkmode}/>
            <div className="DegreeContent">
                <ScheduleView/>
                <SceduleSide/>
            </div>
            
        </div>
    )
}