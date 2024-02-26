import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/system/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import { useForm } from 'react-hook-form'
// firebase imports
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from '../models/firebase.ts';
// data imports
import major_data from '../json/majors.json';
import college_data from '../json/colleges.json';
// css imports
import '../css/Profile.css';

const Advisor_profile = ({userinfo, setUserinfo, user}) => {
  const [missingCollege, setMissingCollege] = useState("");
  const [missingDepartment, setMissingDepartment] = useState("");
  const { handleSubmit } = useForm();

  const submit = () => {
    var go = true;
    if (userinfo.college === "") {
      setMissingCollege("You must select a college");
      go = false;
    }
    else setMissingCollege("");
    if (userinfo.department === "") {
      setMissingDepartment("You must select a department");
      go = false;
    }
    else setMissingDepartment("");
    if (go) {
      console.log(userinfo); // for testing purposes
      // const user = auth.currentUser;
      // if (user) {
      //   const uid = user.uid;
      const user_doc = doc(firestore, "users", "advisor_testing");
      updateDoc(user_doc, {
        college: userinfo.college,
        department: userinfo.department,
      });
      // }
      // else {
      //   setSignedIn(false);
      // }
    }
  }

  return (
    <div>
      <Box className="Ctn">
        <FormControl display="flex" style={{width: 400}}>
          <h3 className="Question">Choose your department:</h3>
          <Autocomplete
          className="Input"
          id="college"
          required={true}
          options={college_data.colleges}
          disableCloseOnSelect
          value={userinfo.college}
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          onChange = {(e, value) => {setUserinfo((previous) => ({...previous, college: value})); setMissingCollege("");}}
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              {option.name}
            </li>
          )}
          renderInput={(params) => (
            <TextField {...params}
            label="Select"
            placeholder="Select"
            required
            error={missingCollege && missingCollege.length?true:false}
            helperText={missingCollege}
            />
          )}
        />
        </FormControl>
        <FormControl display="flex" style={{width: 400}}>
          <h3 className="Question">Choose your department:</h3>
          <Autocomplete
          className="Input"
          id="deparment"
          required={true}
          options={major_data.majors}
          disableCloseOnSelect
          value={userinfo.department}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          getOptionLabel={(option) => option.name}
          onChange = {(e, value) => {setUserinfo((previous) => ({...previous, department: value})); setMissingDepartment("");}}
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              {option.name}
            </li>
          )}
          renderInput={(params) => (
            <TextField {...params}
            label="Select"
            placeholder="Select"
            required
            error={missingDepartment && missingDepartment.length?true:false}
            helperText={missingDepartment}/>
          )}
        />
        </FormControl>
        <Box className="Btn">
          <Button type="submit" onClick={handleSubmit(submit)} variant="outlined">Submit</Button>
        </Box>
      </Box>
    </div>
  )
}

export default Advisor_profile