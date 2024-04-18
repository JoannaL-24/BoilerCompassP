import React , { useState, useEffect } from 'react'
import { useAuth } from '../components/contexts/AuthContext.tsx'
import { doc, getDoc, setDoc, updateDoc, arrayRemove, arrayUnion, Timestamp, addDoc, collection } from "firebase/firestore";
import { firestore } from '../models/firebase.ts';
import RemoteUserdata from '../models/RemoteUserData';
import UserData from "models/UserData.ts";
import "./ZoeyButtonStyle.css"

const CopyScheduleButton = ({scheduleID}) => {

  const { currentUser } = useAuth();
  const [scheduleList, setScheduleList] = useState([]);

  useEffect(() => {
    if (currentUser) {
      const user_doc = getDoc(doc(firestore, "users", currentUser.uid))
        .then((docSnapshot) => {
            setScheduleList(docSnapshot.data().schedule);
        });
    }
  }, [currentUser]);

  
  const copySchedule = () => {
    //copy a schedule doc and put in the database for this user
    console.log(scheduleID);
    getDoc(doc(firestore, "schedules", scheduleID))
      .then((scheduleSnap) => {
          const dbRef = collection(firestore, "schedules");
          const cpy = scheduleSnap.data();
          addDoc(dbRef, cpy)
          .then(docRef => {
            console.log(docRef.id);
            const copied = scheduleList;
            copied.splice(0, 0, docRef.id);
            if (currentUser) {
              const userRef = doc(firestore, "users", currentUser.uid);
              updateDoc(userRef, {
                  "schedule": copied
              })
              .catch((e) => {
                  console.log("update schedule array error");
                  console.log(e);
              })
            }
           
          })
      })
      .catch((error) => {
          console.log(error);
      })
      alert("Schedule Copied!");
  };

  return (
    <div>
      <button className="btn" onClick={copySchedule}>
      {/* <button style={{fontSize: "12px"}} onClick={copySchedule}> */}
        Copy This Schedule
      </button>
    </div>
  )
}

export default CopyScheduleButton
