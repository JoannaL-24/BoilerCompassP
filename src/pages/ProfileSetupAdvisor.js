import React, { useState } from 'react';
import AdvisorProfile from '../components/AdvisorProfile'
import Alert from '@mui/material/Alert';
import { auth } from '../models/firebase.ts';
import '../css/Profile.css';

const Profile_setup_advisors = () => {
  const [userinfo, setUserinfo] = useState({
    role: "advisor",
    college: "",
    department: "",
    students: [],
  });
  const user = auth.currentUser;

  return (
    <div>
      <Alert severity="error" sx={{ display: user ? 'none' : 'flex', top: 0, left: 0, width: '100%', height: '4%'}}>
      {"Please sign in to continue setting up profile"}
      </Alert>
      <h1 className="paget">Profile Setup</h1>
      <AdvisorProfile
      userinfo={userinfo}
      setUserinfo={setUserinfo}
      user={user}
      setup={true}/>
    </div>
  )
}

export default Profile_setup_advisors