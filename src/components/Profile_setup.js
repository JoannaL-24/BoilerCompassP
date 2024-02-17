import React from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/system/Box';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
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
  // readFiles('../txt/majors.txt',majors)
  // readFiles('../txt/minors.txt', minors)

  return (
    <div>
      <h1 className="paget">Profile Setup</h1>
      <Box className="Ctn" style={{ height: "30vh" }}>
      <FormControl sx={{width: 400}}>
        <InputLabel>Age</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          // value={age}
          label="Age"
          // onChange={handleChange}
        >
          {/* {majors.map(major => (
            <MenuItem value={major}>major</MenuItem>
          ))} */}
        </Select>
      </FormControl>
      {/* // <Box>
      //   <Button className="Btn" sx={{mt: 3}} variant="button" variant="outlined">Start</Button>
      // </Box> */}
      </Box>
    </div>
  )
}

export default Profile_setup
