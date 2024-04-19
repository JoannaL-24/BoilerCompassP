import React, { useState, useEffect } from 'react'
import { useAuth } from '../components/contexts/AuthContext.tsx'
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from '../models/firebase.ts';
import RemoteUserdata from '../models/RemoteUserData';
import UserData from "models/UserData.ts";
import "./ZoeyButtonStyle.css"

const ChangeScheduleName = ({ changeScheduleName }) => {

  return (
    <button className="btn" onClick={()=> {changeScheduleName()}}>
      Change Schedule Name
    </button>
  )
}

export default ChangeScheduleName