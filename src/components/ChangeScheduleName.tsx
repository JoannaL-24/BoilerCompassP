import React , { useState, useEffect } from 'react'
import { useAuth } from '../components/contexts/AuthContext.tsx'
import { doc, getDoc, setDoc, updateDoc, arrayRemove, arrayUnion, Timestamp, addDoc, collection } from "firebase/firestore";
import { firestore } from '../models/firebase.ts';
import RemoteUserdata from '../models/RemoteUserData';
import UserData from "models/UserData.ts";
import "./ZoeyButtonStyle.css"

const ChangeScheduleName = ({scheduleID, scheduleList, setscheduleList}) => {

  const { currentUser } = useAuth();
  
  const changeName = () => {
    let newName = prompt("Enter new name")
    if (newName) {
        const userRef = doc(firestore, "schedules", scheduleID);
            updateDoc(userRef, {
                "name": newName
            })
            .catch((e) => {
                console.log("update schedule array error");
                console.log(e);
            })
            setscheduleList({...scheduleList, currName: newName});
    }
    else {
        alert("Schedule name cannot be empty.")
    }
      
  };

  return (
    <div>
      <button className="btn" onClick={changeName}>
        Change Schedule Name
      </button>
    </div>
  )
}

export default ChangeScheduleName