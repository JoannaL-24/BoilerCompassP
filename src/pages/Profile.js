import React, { useState, useEffect } from 'react';
import StudentProfile from '../components/Student_profile'
import AdvisorProfile from '../components/Advisor_profile'
import Alert from '@mui/material/Alert';
import { auth, firestore } from '../models/firebase.ts';
import dayjs from 'dayjs';
import { doc, updateDoc, getDoc, Timestamp } from "firebase/firestore";
import '../css/Profile.css';

const Profile = () => {
  const user = auth.currentUser;
  const [userinfo, setUserinfo] = useState(null);
  const [convertDate, setConverDate] = useState(true);
  useEffect(() => {
    const user_doc = getDoc(doc(firestore, "users", "advisor_testing"))
    .then((docSnapshot) => {
    // here
      setUserinfo(userinfo?userinfo:docSnapshot.data());
    });
  });
  if (userinfo && convertDate) {
    console.log("here");
    if (userinfo.user_type === "advisor") {
      setConverDate(false);
    }
    else {
      setUserinfo((prev)=>({...prev, start_term: dayjs(userinfo.start_term.toDate()), end_term: dayjs(userinfo.end_term.toDate())}));
      setConverDate(false);
    }
  }
  // {userinfo&&convertDate?
  //  (setUserinfo((prev)=>({...prev, start_term: new Date(userinfo.start_term), end_term: new Date(userinfo.end_term)})),
  //   setConverDate(false)) :
  //   (,)}
  // const [userinfo, setUserinfo] = useState({
  //   prefer_majors: userData.prefer_majors,
  //   prefer_minor: userData.prefer_minor,
  //   start_term: userData.start_term,
  //   end_term: userData.end_term;
  // });
  // const [userinfo, setUserinfo] = useState(
  //   user && user_data ? ( user_doc.user_type === "student"
  //     ? {
  //         user_type: "student",
  //         major: user_data.prefer_majors,
  //         minor: user_data.prefer_minor,
  //         start_term: user_data.start_term,
  //         end_term: user_data.end_term,
  //         advisor: user_data.advisor,
  //       }
  //     : {
  //         user_type: "advisor",
  //         college: user_data.college,
  //         department: user_data.department,
  //       }
  //   ) : null
  // );
  // console.log(userinfo.major);

  // getDoc(doc(firestore, "users", "f9RIsQLWoiPjlpVaC3XkPlzeXcr1"))
  // .then((docSnapshot) => {
  //   const user_doc = docSnapshot.data();
  //   console.log(user_doc.prefer_majors); // Now you can access data

  //   // Update userinfo state based on user_doc (if needed)
  //   if (user_doc) {
  //     setUserinfo(
  //       user_doc.user_type === "student"
  //         ? {
  //             user_type: "student",
  //             major: user_doc.prefer_majors,
  //             // ... other properties
  //           }
  //         : {
  //             user_type: "advisor",
  //             college: user_doc.college,
  //             department: user_doc.department,
  //           }
  //     );
  //   } else {
  //     // Handle the case where user_doc is null (e.g., set userinfo to null)
  //   }
  // })
  // .catch((error) => {
  //   console.error("Error fetching user document:", error);
  // });

  return (
    <div>
      <Alert severity="error" sx={{ display: user ? 'none' : 'flex', top: 0, left: 0, width: '100%', height: '4%'}}>
      {"Please sign in to continue viewing your profile"}
      </Alert>
      <h1 className="paget">Your Profile</h1>
      {/* {user && userinfo.user_type==="student" &&
      <StudentProfile
        userinfo={userinfo}
        setUserinfo={setUserinfo}
        user={user}/>} */}
      
      {userinfo && userinfo.user_type === "student" && // add user&&
      <StudentProfile
        userinfo={userinfo}
        setUserinfo={setUserinfo}
        user={user}/>}
      {userinfo && userinfo.user_type==="advisor" &&
        <AdvisorProfile
          userinfo={userinfo}
          setUserinfo={setUserinfo}
          user={user}/>}
    </div>
  )
}

export default Profile
