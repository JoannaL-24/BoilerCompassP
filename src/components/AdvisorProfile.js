
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/system/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import { useForm } from 'react-hook-form'
import { useAuth } from '../components/contexts/AuthContext'
import { useNavigate } from 'react-router-dom';

// firebase imports
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "../models/firebase.ts";
// data imports
import major_data from "../json/majors.json";
import college_data from "../json/colleges.json";
// css imports
import "../css/Profile.css";

const Advisor_profile = ({ userinfo, setUserinfo, setup, setUpdated }) => {
  const [missingCollege, setMissingCollege] = useState("");
  const [missingDepartment, setMissingDepartment] = useState("");
  const { currentUser } = useAuth();
  const { handleSubmit } = useForm();
  const department_q = setup ? "Choose your department:" : "Your department:";
  const college_q = setup ? "Choose your college:" : "Your college:";
  const submit_button_text = setup ? "Submit" : "Edit";
  const navigate = useNavigate();
  // console.log(userinfo);

  const submit = () => {
    var go = true;
    if (userinfo.college === "") {
      setMissingCollege("You must select a college");
      go = false;
    } else setMissingCollege("");
    if (userinfo.department === "") {
      setMissingDepartment("You must select a department");
      go = false;
    } else setMissingDepartment("");
    if (go) {
      console.log(userinfo); // for testing purposes
      if (currentUser) {
        const uid = currentUser.uid;

        const user_doc = doc(firestore, "users", uid);

        updateDoc(user_doc, {
          college: userinfo.college,
          department: userinfo.department,
        });


        (!setup && setUpdated(true));
        if (setup) navigate('/AdvisorHomePage');
      }
      else {

        setSignedIn(false);
      }
    }
  };

  return (
    <div>
      <Box className="Ctn">
        <FormControl display="flex" style={{ width: 400 }}>
          <h3 className="Question">{college_q}</h3>
          <Autocomplete
            className="Input"
            id="college"
            required={true}
            options={college_data.colleges}
            disableCloseOnSelect
            value={userinfo.college}
            getOptionLabel={(option) => option.name}
            onChange={(e, value) => {
              setUserinfo((previous) => ({ ...previous, college: value }));
              setMissingCollege("");
              !setup && setUpdated(false);
            }}
            renderOption={(props, option, { selected }) => (
              <li {...props}>{option.name}</li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select"
                // label={userinfo.college.length==0?"Select":""}
                placeholder="Select"
                required
                error={missingCollege && missingCollege.length ? true : false}
                helperText={missingCollege}
              />
            )}
          />
        </FormControl>
        <FormControl display="flex" style={{ width: 400 }}>
          <h3 className="Question">{department_q}</h3>
          <Autocomplete
            className="Input"
            id="deparment"
            required={true}
            options={major_data.majors}
            disableCloseOnSelect
            value={userinfo.department}
            getOptionLabel={(option) => option.name}
            onChange={(e, value) => {
              setUserinfo((previous) => ({ ...previous, department: value }));
              setMissingDepartment("");
              !setup && setUpdated(false);
            }}
            renderOption={(props, option, { selected }) => (
              <li {...props}>{option.name}</li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select"
                placeholder="Select"
                required
                error={
                  missingDepartment && missingDepartment.length ? true : false
                }
                helperText={missingDepartment}
              />
            )}
          />
        </FormControl>
        <Box className="Btn">
          <Button
            type="submit"
            onClick={handleSubmit(submit)}
            variant="outlined"
          >
            {submit_button_text}
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default Advisor_profile;
