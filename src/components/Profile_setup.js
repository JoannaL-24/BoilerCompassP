import React from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/system/Box';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Grid from '@mui/material/Grid';
import '../css/Profile.css';

const Profile_setup = () => {
  // const readFiles = (fileName, arr) => {
  //   const fs = require('fs');
  //   fs.readFile(fileName, 'utf8', (err, data) => {
  //     if (err) {
  //       console.log('err');
  //       return;
  //     }
  //     arr = data.split('\n')
  //   });
  // }
  // const majors = {};
  // const minors = {};
  // readFiles('../txt/majors.txt',majors);
  // readFiles('../txt/minors.txt', minors);
  // module.exports = {majors, minors};
  // const { majors } = require('../index.js');
  const majors = [ 'Computer Science', 'Economics', 'Mathematics' ];
  return (
    <div>
      <h1 className="paget">Profile Setup</h1>
      <Box className="Ctn" style={{ height: "30vh" }}>
      <FormControl display="flex" style={{width: 400}}>
      <h3 align="left" className="Question">Choose your major:</h3>
        <InputLabel sx={{mt: "4.8em"}} id="major">Select</InputLabel>
        <Select
          labelId="major"
          // id="demo-simple-select"
          // value={age}
          sx={{ mt: "1em" }}
          label="Select"
          // notched={true}
          // onChange={handleChange}
        >
          {majors.map(major => (
            <MenuItem value={major} key={major}>{major}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl display="flex" style={{width: 400}}>
      <h3 align="left" className="Question">Select your minor:</h3>
        <InputLabel sx={{mt: "4.8em"}} id="minor">Select</InputLabel>
        <Select
          labelId="minor"
          // id="demo-simple-select"
          // value={age}
          sx={{ mt: "1em" }}
          default="N/A"
          label="Select"
          // notched={true}
          // onChange={handleChange}
        >
          {majors.map(major => (
            <MenuItem value={major} key={major}>{major}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl display="flex" style={{width: 400}}>
        <h3 align="left" className="Question">When did you start school at Purdue?</h3>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker sx={{ mt: "1em" }} label="Select date"/>
          <h3 align="left" className="Question">Expected graduation date:</h3>
          <DatePicker sx={{ mt: "1em" }} label="Select date"/>
        </LocalizationProvider>
      </FormControl>

        <Box>
          <Button className="Btn" sx={{mt: "4em"}} variant="button" variant="outlined">Submit</Button>
        </Box>
      </Box>
    </div>
  )
}

export default Profile_setup
