import React , { useState, useEffect } from 'react'
import { useAuth } from '../components/contexts/AuthContext.tsx'
import { doc, getDoc, updateDoc, arrayRemove, arrayUnion, Timestamp, addDoc, collection } from "firebase/firestore";
import { firestore } from '../models/firebase.ts';
import RemoteUserdata from '../models/RemoteUserData';
import UserData from "models/UserData.ts";

const CopyScheduleButton = () => {

  const { currentUser } = useAuth();
  const userData: UserData = new RemoteUserdata();

  useEffect(() => {
    if (currentUser) {
      const user_doc = getDoc(doc(firestore, "users", currentUser.uid))
        .then((docSnapshot) => {
            
        });
    }
  }, [currentUser]);

  const copySchedule = () => {
    //copy a schedule doc and put in the database for this user
  };

  return (
    <div>
      <button className="mediumBtn goldBtn" onClick={copySchedule}>
        <h3>Copy This Schedule</h3>
      </button>
    </div>
  )
}

export default CopyScheduleButton
