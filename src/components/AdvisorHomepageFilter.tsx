import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import AccountCircle from "@mui/icons-material/AccountCircle";
import firebase from "firebase/app";
import { initializeApp } from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "../models/firebase.ts";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import "./AdvisorHomepageFilter.css";

import app from "../models/firebase.ts";
import { useAuth } from "../components/contexts/AuthContext";

function AdvisorHomepageFilter() {
  const [value, setValue] = useState("female");
  const [userNames, setUserNames] = useState<
    { name: string; purdue_email: string; prefer_majors: { name: string }[] }[]
  >([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [clickedUser, setClickedUser] = useState(null);
  const [hoveredUser, setHoveredUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { currentUser } = useAuth();

  useEffect(() => {
    const firestore = getFirestore(app);
    const fetchUserNames = async () => {
      const usersSnapshot = await getDocs(collection(firestore, "users"));
      const usersData: {
        name: string;
        purdue_email: string;
        prefer_majors: { name: string }[];
        user_type: string;
      }[] = [];
      usersSnapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData.user_type === "student") {
          usersData.push({
            name: userData.name,
            purdue_email: userData.purdue_email,
            prefer_majors: userData.prefer_majors || [],
            user_type: userData.user_type,
          });
        }
      });
      setUserNames(usersData);
    };

    fetchUserNames();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleUserClick = (userData: any) => {
    setSelectedUser(userData);
    setClickedUser(userData);
    setTimeout(() => {
      setClickedUser(null);
    }, 50); // time
  };

  const filteredUserNames = userNames.filter((user) => {
    const query = searchQuery?.toLowerCase() || "";
    console.log("user:", user);
    console.log("query:", query);
    console.log("user.name:", user.name);
    console.log("user.purdue_email:", user.purdue_email);
    console.log("user.prefer_majors:", user.prefer_majors);

    return (
      user.name.toLowerCase().includes(query) ||
      user.purdue_email.toLowerCase().includes(query) ||
      user.prefer_majors.some((major) =>
        major.name.toLowerCase().includes(query)
      )
    );
  });

  return (
    <div className="AddsivorHomePageFilter">
      <div className="studentSearching">
        <div>
          <AccountCircle sx={{ color: "action.active", mr: 1, my: 0.5 }} />
          <TextField
            id="input-with-sx"
            label="Search student"
            variant="standard"
            style={{ width: "200px" }}
            onChange={(e) => setSearchQuery(e.target.value)} // update search state
          />
        </div>
        <br />
        <FormControl
          sx={{
            border: "2px solid black",
            borderRadius: "5px",
            padding: "10px",
          }}
        >
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={value}
            onChange={handleChange}
          >
            <FormControlLabel
              value="alphabetincrease"
              control={
                <Radio
                  sx={{
                    "& .MuiSvgIcon-root": {
                      fontSize: 35,
                    },
                  }}
                />
              }
              label="Sort alphabetically (ascending)"
            />
            <FormControlLabel
              value="alphabetdecrease"
              control={
                <Radio
                  sx={{
                    "& .MuiSvgIcon-root": {
                      fontSize: 35,
                    },
                  }}
                />
              }
              label="Sort alphabetically (descending)"
            />
            <FormControlLabel
              value="yearincrease"
              control={
                <Radio
                  sx={{
                    "& .MuiSvgIcon-root": {
                      fontSize: 35,
                    },
                  }}
                />
              }
              label="Sort by year (ascending)"
            />
            <FormControlLabel
              value="yeardecrease"
              control={
                <Radio
                  sx={{
                    "& .MuiSvgIcon-root": {
                      fontSize: 35,
                    },
                  }}
                />
              }
              label="Sort by year (descending)"
            />
          </RadioGroup>
        </FormControl>
      </div>

      <div className="searchResult">
        {filteredUserNames.map((user, index) => (
          <a
            key={index}
            href="#"
            onClick={() => handleUserClick(user)}
            onMouseEnter={() => setHoveredUser(user)}
            onMouseLeave={() => setHoveredUser(null)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textDecoration: "none",
              //border: "1px solid black",
              borderRadius: "20px",
              width: "160px",
              padding: "10px",
              marginRight: "50px",
              marginBottom: "10px",
              transform: `${clickedUser === user ? "scale(0.3)" : "scale(1)"} ${
                hoveredUser === user ? "scale(1.2)" : "scale(1)"
              }`,
              transition: "transform 0.5s ease",

              backgroundColor: hoveredUser === user ? "#87ceeb" : "", // background color
              color: hoveredUser === user ? "white" : "", // text color
              boxShadow:
                hoveredUser === user
                  ? "10px 10px 20px rgba(128, 229, 216, 1)"
                  : "", // shadow

              border:
                hoveredUser === user ? "1px solid white" : "1px solid black",
            }}
          >
            <AccountCircle sx={{ color: "action.active", fontSize: "40px" }} />
            <span style={{ marginTop: "5px" }}>{user.name}</span>{" "}
          </a>
        ))}
      </div>
      {/* Popup to display user data */}
      {selectedUser && (
        <div
          style={{
            position: "fixed",

            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
            animation: "dropTop 0.3s ease-in",
          }}
        >
          <h2>User Details</h2>
          <p>Name: {selectedUser.name}</p>
          <p>Email: {selectedUser.purdue_email}</p>
          <p>Prefer Majors:</p>
          <ul>
            {selectedUser.prefer_majors.map(
              (major: { name: string }, index: number) => (
                <li key={index}>{major.name}</li>
              )
            )}
          </ul>
          <button onClick={() => setSelectedUser(null)}>Close</button>
        </div>
      )}
    </div>
  );
}
export default AdvisorHomepageFilter;
