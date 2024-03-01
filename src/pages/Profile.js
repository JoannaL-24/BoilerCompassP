import React, { useState, useEffect } from 'react';
import StudentProfile from '../components/StudentProfile'
import AdvisorProfile from '../components/AdvisorProfile'
import Alert from '@mui/material/Alert';
import { firestore } from '../models/firebase.ts';
import { useAuth } from '../components/contexts/AuthContext';
import dayjs from 'dayjs';
import { doc, updateDoc, getDoc, Timestamp } from "firebase/firestore";
import '../css/Profile.css';

const Profile = () => {
  const { currentUser } = useAuth();
  const [userinfo, setUserinfo] = useState(null);
  const [convertDate, setConverDate] = useState(true);
  const [updated, setUpdated] = useState(false);
  useEffect(() => {
    if (currentUser) {
      const user_doc = getDoc(doc(firestore, "users", currentUser.uid))
      .then((docSnapshot) => {
        setUserinfo(userinfo?userinfo:docSnapshot.data());
      });
      if (userinfo && convertDate) {
        if (userinfo.user_type === "advisor") {
          setConverDate(false);
        }
        else {
          setUserinfo((prev)=>({...prev, start_term: dayjs(userinfo.start_term.toDate()), end_term: dayjs(userinfo.end_term.toDate())}));
          setConverDate(false);
          // console.log(userinfo);
        }
      }
    }
  }, [currentUser]);

  return (
    <div>
      <Alert severity="error" sx={{ display: currentUser ? 'none' : 'flex', top: 0, left: 0, width: '100%', height: '4%'}}>
      {"Please sign in to continue viewing your profile"}
      </Alert>
      <Alert severity="success" sx={{ display: !updated? 'none' : 'flex', top: 0, left: 0, width: '100%', height: '4%'}}>
      {"Your profile was updated successfully!"}
      </Alert>
      {currentUser && <h1 className="paget">Your Profile</h1>}
      {userinfo && userinfo.user_type === "student" && // add user&&
      <StudentProfile
        userinfo={userinfo}
        setUserinfo={setUserinfo}
        setup={false}
        setUpdated={setUpdated}/>}
      {userinfo && userinfo.user_type==="advisor" &&
        <AdvisorProfile
          userinfo={userinfo}
          setUserinfo={setUserinfo}
          setup={false}
          setUpdated={setUpdated}/>}
    </div>
  )
}

export default Profile
