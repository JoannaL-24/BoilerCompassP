import React, { useState, useEffect } from 'react';
import StudentProfile from '../components/StudentProfile'
import AdvisorProfile from '../components/AdvisorProfile'
import Alert from '@mui/material/Alert';
import { auth, firestore } from '../models/firebase.ts';
import dayjs from 'dayjs';
import { doc, updateDoc, getDoc, Timestamp } from "firebase/firestore";
import '../css/Profile.css';

const Profile = () => {
  const user = auth.currentUser;
  const [userinfo, setUserinfo] = useState(null);
  const [convertDate, setConverDate] = useState(true);
  // useEffect(() => {
    const user_doc = getDoc(doc(firestore, "users", "advisor_testing"))
    .then((docSnapshot) => {
      setUserinfo(userinfo?userinfo:docSnapshot.data());
    });
  // });
  if (userinfo && convertDate) {
    if (userinfo.user_type === "advisor") {
      setConverDate(false);
    }
    else {
      setUserinfo((prev)=>({...prev, start_term: dayjs(userinfo.start_term.toDate()), end_term: dayjs(userinfo.end_term.toDate())}));
      setConverDate(false);
    }
  }

  return (
    <div>
      <Alert severity="error" sx={{ display: user ? 'none' : 'flex', top: 0, left: 0, width: '100%', height: '4%'}}>
      {"Please sign in to continue viewing your profile"}
      </Alert>
      <h1 className="paget">Your Profile</h1>
      {userinfo && userinfo.user_type === "student" && // add user&&
      <StudentProfile
        userinfo={userinfo}
        setUserinfo={setUserinfo}
        user={user}
        setup={false}/>}
      {userinfo && userinfo.user_type==="advisor" &&
        <AdvisorProfile
          userinfo={userinfo}
          setUserinfo={setUserinfo}
          user={user}
          setup={false}/>}
    </div>
  )
}

export default Profile
