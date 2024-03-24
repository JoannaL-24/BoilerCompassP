import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import AdvisorHomepageFilter from "./AdvisorHomepageFilter";
import SettingsIcon from "@mui/icons-material/Settings";
import NavBar from "./NavBar/NavBar";

import { useAuth } from "../components/contexts/AuthContext";
import { ThemeProvider, createTheme } from "@mui/material";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { firestore } from '../models/firebase.ts';
import './AdvisorHomepage.css'
//const { currentUser } = useAuth();

type Props = {
  darkmode:boolean;
  setDarkmode: React.Dispatch<React.SetStateAction<boolean>>;
}

function AdvisorHomepage({darkmode, setDarkmode}: Props) {
  const { currentUser } = useAuth();

    useEffect(() => {
        if (currentUser) {
            const user_doc = getDoc(doc(firestore, "users", currentUser.uid))
                .then((docSnapshot) => {
                    setDarkmode(docSnapshot.data().dark_mode);
                });
        }
    }, [currentUser]);

    var mode_str;
    if (darkmode) {
        mode_str = "dark";
    }
    else {
        mode_str = "light"
    }
    const mode = createTheme({
        palette: {
          mode: mode_str,
          // primary: {
          //   // main: orange[500]
          // }
        },
    });
  return (
    // <div style={darkmode ? {backgroundColor: '#282c34', color: '#ffffff', display: "flex", flexDirection:"column"} : {backgroundColor: '#f5f3eb', color: '#282c34', display: "flex", flexDirection:"column"}}>
    <div className="advisorHome">
      <ThemeProvider theme = {mode}>
        <NavBar
          darkmode={darkmode}
          setDarkmode={setDarkmode}/>
        <AdvisorHomepageFilter />
      </ThemeProvider>
    </div>
  )
}

export default AdvisorHomepage;
