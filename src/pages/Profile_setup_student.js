import React, { useState } from 'react';
import StudentProfile from '../components/Student_profile'
import Alert from '@mui/material/Alert';
import { auth } from '../models/firebase.ts';
import '../css/Profile.css';

const Profile_setup_students = () => {
  const [signedIn, setSignedIn] = useState(true);
  const [userinfo, setUserinfo] = useState({
    user_type: "student",
    major: [],
    minor: [],
    start_term: null,
    end_term: null,
    advisor: "",
    group: [],
  });
  const user = auth.currentUser;

  return (
    <div>
      <Alert severity="error" sx={{ display: signedIn ? 'none' : 'flex', top: 0, left: 0, width: '100%', height: '4%'}}>
      {"Please sign in to continue setting up profile"}
      </Alert>
      <h1 className="paget">Profile Setup</h1>
      <StudentProfile
      userinfo={userinfo}
      setUserinfo={setUserinfo}
      user={user}
      signedIn={signedIn}
      setSignedIn={setSignedIn}/>
    </div>
  )
}

export default Profile_setup_students