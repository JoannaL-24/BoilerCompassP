import React, { useState } from 'react';
import AdvisorProfile from '../components/AdvisorProfile'
import Alert from '@mui/material/Alert';
import { useAuth } from '../components/contexts/AuthContext'
import '../css/Profile.css';

const Profile_setup_advisors = () => {
  const { currentUser } = useAuth();
  const [userinfo, setUserinfo] = useState({
    user_type: "advisor",
    college: null,
    department: null,
    students: [],
  });

  return (
    <div>
      {/* <Alert severity="error" sx={{ display: currentUser ? 'none' : 'flex', top: 0, left: 0, width: '100%', height: '4%'}}>
      {"Please sign in to continue setting up profile"}
      </Alert> */}
      <h1 className="paget">Profile Setup</h1>
      <AdvisorProfile
      userinfo={userinfo}
      setUserinfo={setUserinfo}
      setup={true}/>
    </div>
  )
}

export default Profile_setup_advisors