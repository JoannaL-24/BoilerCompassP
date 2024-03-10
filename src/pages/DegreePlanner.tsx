import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar/NavBar";
import ScheduleView from "../components/ScheduleView/ScheduleView";
import SceduleSide from "../components/ScheduleSide/ScheduleSide";
import './DegreePlanner.css';
// firebase imports
import { useAuth } from '../components/contexts/AuthContext.tsx'
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { firestore } from '../models/firebase.ts';
// react beautiful dnd imports
import { DragDropContext } from "react-beautiful-dnd";      

// sidebar import
import "../components/ScheduleSide/ScheduleSide.css";
import Searchbar from "components/Searchbar.js";
// search bar input
import "../components/Searchbar.css";
import Semester from "components/Semester/Semester.tsx";


export default function DegreePlanner() {
    //get current user and mode preference
    const { currentUser } = useAuth();
    const [darkmode, setDarkmode] = useState<boolean>(true);

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
                <DragDropContext onDragEnd = {() => {
                        console.log("drag occured");
                }}>
                <ScheduleView />
                <div className="ScheduleSide">
                    <button className="mediumBtn goldBtn"><h3>Requirement</h3></button>
                    <Searchbar />
                </div>
                </DragDropContext>
            </div>

        </div>
    )
}