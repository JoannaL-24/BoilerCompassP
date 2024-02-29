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
import { useForm } from 'react-hook-form'
// firebase imports
import { doc, updateDoc, Timestamp } from "firebase/firestore";
import { firestore } from '../models/firebase.ts';
// data imports
import major_data from '../json/majors.json';
import minor_data from '../json/minors.json';
// css imports
import '../css/Profile.css';

const Student_profile = ({userinfo, setUserinfo, signedIn, setSignedIn, user}) => {
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const year = dayjs().get('year');
  const validStartYear = (date) => !(( year  - date.get('year') >= 0) && (year - date.get('year') <= 10));
  const validEndYear = (date) => !(( date.get('year') - year >= 0) && (date.get('year') - year <= 10));
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [missingMajor, setMissingMajor] = useState("");
  const { handleSubmit } = useForm();

  const submit = () => {
    var go = true;
    if (!userinfo.major || !userinfo.major.length) {
      setMissingMajor("You must select at least one major");
      go = false;
    }
    else setMissingMajor("");
    if (!userinfo.start_term) {
      setStart("You must select a start date");
      go = false;
    }
    else setStart("");
    if (!userinfo.end_term) {
      setEnd("You must select an end date");
      go = false;
    }
    else setEnd("");
    if (go) {
      console.log(userinfo); // for testing purposes
      // const user = auth.currentUser;
      // if (user) {
      //   const uid = user.uid;
      const user_doc = doc(firestore, "users", "f9RIsQLWoiPjlpVaC3XkPlzeXcr1");
      updateDoc(user_doc, {
        prefer_majors: userinfo.major,
        prefer_minor: userinfo.minor,
        user_type: userinfo.user_type,
        advisor: userinfo.advisor,
        start_term: Timestamp.fromDate(new Date(userinfo.start_term)),
        end_term: Timestamp.fromDate(new Date(userinfo.end_term)),
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
          <h3 className="Question">Choose your major(s):</h3>
          <Autocomplete
          className="Input"
          multiple
          id="majors"
          options={major_data.majors}
          disableCloseOnSelect
          value={userinfo.major}
          required={true}
          getOptionLabel={(option) => option.name}
          onChange = {(e, value) => {setUserinfo((previous) => ({...previous, major: value})); setMissingMajor("");}}
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
            required
            error={missingMajor && missingMajor.length?true:false}
            helperText={missingMajor}
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
          required={true}
          options={minor_data.minors}
          disableCloseOnSelect
          defaultValue={userinfo.minor}
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
            <TextField {...params}
            label="Select one or more"
            placeholder="Select one or more"/>
          )}
        />
        </FormControl>
        <FormControl display="flex" style={{width: 400}}>
          <h3 className="Question">When did you start school at Purdue?</h3>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              sx={{ mt: "1em", mb: "2em"}}
              label="Select start date *"
              shouldDisableYear={validStartYear}
              defaultValue={userinfo.start_term}
              onChange = {(value) => {setUserinfo((previous) => ({...previous, start_term: value})); setStart("");}}
              slotProps={{
                textField: {
                  error: start && start.length?true:false,
                  helperText: start,
                },
              }}
            />
            <h3 className="Question">Expected graduation date:</h3>
            <DatePicker
              sx={{ mt: "1em"}}
              label="Select end date *"
              shouldDisableYear={validEndYear}
              defaultValue={userinfo.end_term}
              onChange = {(value) => {setUserinfo((previous) => ({...previous, end_term: value})); setEnd("");}}
              slotProps={{
                textField: {
                  error: end && end.length?true:false,
                  helperText: end,
                },
              }}
            />
          </LocalizationProvider>
        </FormControl>
        <Box className="Btn">
          <Button type="submit" onClick={handleSubmit(submit)} variant="outlined">Submit</Button>
        </Box>
      </Box>
    </div>
  )
}

export default Student_profile