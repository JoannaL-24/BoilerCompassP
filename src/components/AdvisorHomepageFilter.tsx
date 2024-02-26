import React, { useState } from "react";
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
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";
import app from "../models/firebase.ts";
function AdvisorHomepageFilter() {
  const [value, setValue] = React.useState("female");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  return (
    <div
      style={{
        width: "100%",
        borderTop: "1px solid gray",
        marginTop: "100px",
        paddingTop: "100px",
        // marginBottom: "10px",
      }}
    >
      <FormControl
        sx={{ border: "2px solid black", borderRadius: "5px", padding: "10px" }}
      >
        {/* <FormLabel id="demo-controlled-radio-buttons-group" sx={{ fontSize: 30 }}>
        Sort
      </FormLabel>*/}
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
      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)", // Center the text field horizontally
          bottom: "-10px",
        }}
      >
        <AccountCircle sx={{ color: "action.active", mr: 1, my: 0.5 }} />
        <TextField
          id="input-with-sx"
          label="Seach student"
          variant="standard"
          style={{ width: "200px", paddingBottom: "800px" }} // text field
        />
      </div>
      {/* Rectangular region with five <a> elements */}
      <div
        style={{
          display: "flex",
          //justifyContent: "space-between",
          position: "relative",
          left: "60%",
          transform: "translateX(-50%)", // center the student horizontally
          bottom: "200px", // adjust the vertical position
          width: "70%", // adjust the width of the student
        }}
      >
        {[...Array(5)].map((_, index) => (
          <a
            key={index}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textDecoration: "none",
              border: "1px solid black",
              borderRadius: "20px",
              width: "calc(20% - 10px)", // adjust the width of each <a> element
              padding: "10px",
              marginRight: "50px",
            }}
          >
            <AccountCircle sx={{ color: "action.active", fontSize: "40px" }} />
            <span style={{ marginTop: "5px" }}>Name</span>
          </a>
        ))}
      </div>
    </div>
  );
}

export default AdvisorHomepageFilter;
