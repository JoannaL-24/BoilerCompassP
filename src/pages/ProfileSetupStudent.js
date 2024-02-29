import React, { useState } from 'react';
import StudentProfile from '../components/StudentProfile'
import Alert from '@mui/material/Alert';
import { useAuth } from '../components/contexts/AuthContext'
import '../css/Profile.css';

const ProfileSetupStudents = () => {
  const { currentUser } = useAuth();
  const [userinfo, setUserinfo] = useState({
    user_type: "student",
    prefer_majors: [],
    prefer_minor: [],
    start_term: null,
    end_term: null,
  });

  return (
    <div>
      <Alert severity="error" sx={{ display: currentUser ? 'none' : 'flex', top: 0, left: 0, width: '100%', height: '4%' }}>
        {"Please sign in to continue setting up profile"}
      </Alert>
      <h1 className="paget">Profile Setup</h1>
      <StudentProfile
        userinfo={userinfo}
        setUserinfo={setUserinfo}
        setup={true} />
    </div>
  )
}

export default ProfileSetupStudents