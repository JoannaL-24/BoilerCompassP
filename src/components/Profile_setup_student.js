import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/system/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Checkbox from '@mui/material/Checkbox';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import dayjs from 'dayjs';
import Alert from '@mui/material/Alert';
// firebase imports
import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
// data imports
import major_data from '../json/majors.json';
import minor_data from '../json/minors.json';
// css imports
import '../css/Profile.css';

const Profile_setup = () => {
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const [userinfo, setUserinfo] = useState({
    user_type: "student",
    major: [],
    minor: [],
    start_term: "",
    end_term: "",
    advisor: "",
    group: [],
  });

  const [signedIn, setSignedIn] = useState(true);

  // const firebaseConfig = {
  //   //...
  // };
  
  // const app = initializeApp(firebaseConfig);
  // const db = getFirestore(app);
  // const auth = getAuth();
  // const user = auth.currentUser;
  const user = null;

  const handleSubmit = (e) => {
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

  const year = dayjs().get('year');
  const validStartYear = (date) => !(( year  - date.get('year') >= 0) && (year - date.get('year') <= 10));
  const validEndYear = (date) => !(( date.get('year') - year >= 0) && (date.get('year') - year <= 10));

  return (
    <div>
      <Alert severity="error" sx={{ display: signedIn ? 'none' : 'flex', top: 0, left: 0, width: '100%', height: '4%'}}>
      Please sign in first to set up your profile
      </Alert>
      <h1 className="paget">Profile Setup</h1>
      <Box className="Ctn">
      <FormControl display="flex" style={{width: 400}}>
        <h3 className="Question">Choose your major(s):</h3>
        <Autocomplete
        className="Input"
        multiple
        id="majors"
        options={major_data.majors}
        disableCloseOnSelect
        getOptionLabel={(option) => option.name}
        onChange = {(e, value) => setUserinfo((previous) => ({...previous, major: value}))}
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option.name}
          </li>
        )}
        renderInput={(params) => (
          <TextField {...params}
          label="Select one or more"
          placeholder="Select one or more"
          required={true}
          />
        )}
      />
      </FormControl>
      <FormControl display="flex" style={{width: 400}}>
        <h3 className="Question">Choose your minor(s):</h3>
        <Autocomplete
        className="Input"
        multiple
        id="minors"
        options={minor_data.minors}
        disableCloseOnSelect
        getOptionLabel={(option) => option.name}
        onChange = {(e, value) => setUserinfo((previous) => ({...previous, minor: value}))}
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option.name}
          </li>
        )}
        renderInput={(params) => (
          <TextField {...params} label="Select one or more" placeholder="Select one or more" />
        )}
      />
      </FormControl>
      <FormControl display="flex" style={{width: 400}}>
        <h3 className="Question">When did you start school at Purdue?</h3>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          //  inputFormat="DD/MM/YYY"
           sx={{ mt: "1em", mb: "2em"}}
           label="Select date"
           required={true}
           shouldDisableYear={validStartYear}
           onChange={(e, value) => setUserinfo((previous) => ({...previous, start_term: value}))}/>
          <h3 className="Question">Expected graduation date:</h3>
          <DatePicker
          //  inputFormat="DD/MM/YYY"
           sx={{ mt: "1em"}}
           label="Select date"
           required={true}
           shouldDisableYear={validEndYear}
           onChange={(e, value) => setUserinfo((previous) => ({...previous, end_term
      : value}))}/>
        </LocalizationProvider>
      </FormControl>

        <Box className="Btn">
          <Button onClick={handleSubmit} variant="outlined">Submit</Button>
        </Box>
      </Box>
    </div>
  )
}

export default Profile_setup
