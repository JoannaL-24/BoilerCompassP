import React, { useState, useEffect } from "react";
import StudentProfile from "../components/StudentProfile";
import AdvisorProfile from "../components/AdvisorProfile";
import Alert from "@mui/material/Alert";
import { firestore } from "../models/firebase.ts";
import { useAuth } from "../components/contexts/AuthContext";
import dayjs from "dayjs";
import { doc, updateDoc, getDoc, Timestamp } from "firebase/firestore";
import "../css/Profile.css";
import { PfpForm } from "components/PfpForm";
import RemoteUserdata from "../models/RemoteUserData";
import { ThemeProvider, createTheme } from "@mui/material";

const Profile = ({darkmode}) => {
  const { currentUser } = useAuth();
  const userData: UserData = new RemoteUserdata();
  const [userinfo, setUserinfo] = useState(null);
  const [convertDate, setConverDate] = useState(true);
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    if (currentUser) {
      // const user_doc = getDoc(doc(firestore, "users", currentUser.uid)).then(
      //   (docSnapshot) => {
      //     const userData = docSnapshot.data();
      //     if (userData) {
      //       setUserinfo(userinfo ? userinfo : userData);
      //     }
      //     //setUserinfo(userinfo?userinfo:docSnapshot.data());
      //   }
      // );
      userData.getAll()
        .then((data) => {
          setUserinfo(data);
          if (convertDate) {
            if (data.user_type === "advisor") {
              setConverDate(false);
            } else {
              setUserinfo((prev) => ({
                ...prev,
                start_term: dayjs(data.start_term.toDate()),
                end_term: dayjs(data.end_term.toDate()),
              }));
              setConverDate(false);
            }
          }
          console.log(data);
        })
        .catch((error) => {
          console.error('Error fetching user type:', error);
        });
    }
  }, [currentUser]);

  
  var mode_str;
  console.log("profile dark: " + darkmode);
  if (darkmode) {
      mode_str = "dark";
  }
  else {
      mode_str = "light";
  }
  const mode = createTheme({
    palette: {
      mode: mode_str,
    },
  });

  return (
    <ThemeProvider theme = {mode}>
      <div style={darkmode ? {backgroundColor: '#282c34', color: '#ffffff'} : {backgroundColor: '#f5f3eb', color: '#282c34'}}>
        <Alert
          severity="error"
          sx={{
            display: currentUser ? "none" : "flex",
            top: 0,
            left: 0,
            width: "100%",
            height: "4%",
          }}
        >
          {"Please sign in to continue viewing your profile"}
        </Alert>
        <Alert
          severity="success"
          sx={{
            display: !updated ? "none" : "flex",
            top: 0,
            left: 0,
            width: "100%",
            height: "4%",
          }}
        >
          {"Your profile was updated successfully!"}
        </Alert>
        {currentUser && userinfo && <h1 className="paget">Your Profile</h1>}
        <PfpForm />
        {userinfo &&
          userinfo.user_type === "student" && ( // add user&&
            <StudentProfile
              userinfo={userinfo}
              setUserinfo={setUserinfo}
              setup={false}
              setUpdated={setUpdated}
            />
          )}
        {userinfo && userinfo.user_type === "advisor" && (
          <AdvisorProfile
            userinfo={userinfo}
            setUserinfo={setUserinfo}
            setup={false}
            setUpdated={setUpdated}
          />
        )}
      </div>
    </ThemeProvider>
  );
};

export default Profile;
