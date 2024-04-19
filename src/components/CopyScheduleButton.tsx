import React, { useState, useEffect } from "react";
import { useAuth } from "../components/contexts/AuthContext.tsx";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayRemove,
  arrayUnion,
  Timestamp,
  addDoc,
  collection,
} from "firebase/firestore";
import { firestore } from "../models/firebase.ts";
import RemoteUserdata from "../models/RemoteUserData";
import UserData from "models/UserData.ts";
import "./ZoeyButtonStyle.css";

const CopyScheduleButton = ({copySchedule}) => {

  return (
    userType === "student" && (
      <div>
        <button className="btn" onClick={copySchedule}>
          {/* <button style={{fontSize: "12px"}} onClick={copySchedule}> */}
          Copy This Schedule
        </button>
      </div>
    )
  );
};

export default CopyScheduleButton;
