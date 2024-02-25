import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import StudentProfile from './Student_profile'
import Alert from '@mui/material/Alert';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
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

  // const firebaseConfig = {
  //   //...
  // };
  
  // const app = initializeApp(firebaseConfig);
  // const db = getFirestore(app);
  // const auth = getAuth();
  // const user = auth.currentUser;
  const user = null;

  const submit_function = (e) => {
    console.log(userinfo); // for testing purposes
    if (user) {
      const uid = user.uid;
      getAuth()
        .updateUser(uid, {
          prefer_majors: userinfo.major,
          prefer_minor: userinfo.minor,
          user_type: userinfo.user_type,
          advisor: userinfo.advisor,
        })
        .then((userRecord) => {
          // indicate success and bring user to home page
          console.log('Successfully updated user', userRecord.toJSON());
        })
        .catch((error) => {
          console.log('Error updating user:', error);
        });
    }
    else {
      setSignedIn(false);
    }
  };

  return (
    <div>
      <Alert severity="error" sx={{ display: signedIn ? 'none' : 'flex', top: 0, left: 0, width: '100%', height: '4%'}}>
      {"Please sign in to continue setting up profile"}
      </Alert>
      <h1 className="paget">Profile Setup</h1>
      <StudentProfile
      submit_function={submit_function}
      userinfo={userinfo}
      setUserinfo={setUserinfo}/>
    </div>
  )
}

export default Profile_setup_students