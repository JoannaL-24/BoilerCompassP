import React, { useState } from 'react';
import StudentProfile from '../components/StudentProfile'
import Alert from '@mui/material/Alert';
import { useAuth } from '../components/contexts/AuthContext'
import { Schedule } from '../models/BoilerCompass'
import '../css/Profile.css';

const ProfileSetupStudents = () => {
  const { currentUser } = useAuth();

  const schedule: Schedule = {
    name: "",
    start_term: null,
    end_term: null,
    semester_blocks: [],
    majors: [],
    minors: [],
  }

  const [userinfo, setUserinfo] = useState({
    user_type: "student",
    prefer_majors: [],
    prefer_minor: [],
    schedule: schedule,
    start_term: null,
    end_term: null,
    advisor: "Purdue Pete",
    completed_courses: ["MA511", "MA265"],
    planned_courses: [],
  });

  return (
    <div>
      {/* <Alert severity="error" sx={{ display: currentUser ? 'none' : 'flex', top: 0, left: 0, width: '100%', height: '4%' }}>
        {"Please sign in to continue setting up profile"}
      </Alert> */}
      <h1 className="paget">Profile Setup</h1>
      <StudentProfile
        userinfo={userinfo}
        setUserinfo={setUserinfo}
        setup={true} />
    </div>
  )
}

export default ProfileSetupStudents