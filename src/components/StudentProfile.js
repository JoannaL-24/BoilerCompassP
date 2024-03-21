import React, { useState, useEffect } from 'react';
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
import { useAuth } from '../components/contexts/AuthContext'
import { useNavigate } from 'react-router-dom';
// firebase imports
import { doc, updateDoc, Timestamp } from "firebase/firestore";
import { firestore } from '../models/firebase.ts';
// data imports
import major_data from '../json/majors.json';
import minor_data from '../json/minors.json';
// css imports
import '../css/Profile.css';

const Student_profile = ({userinfo, setUserinfo, setup, setUpdated}) => {
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const { currentUser } = useAuth();
  const year = dayjs().get('year');
  const validStartYear = (date) => !(( year  - date.get('year') >= 0) && (year - date.get('year') <= 10));
  const validEndYear = (date) => !(( date.get('year') - year >= 0) && (date.get('year') - year <= 10));
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [missingMajor, setMissingMajor] = useState("");
  const { handleSubmit } = useForm();
  const prefer_majors_q = setup?"Choose your major(s):":"Your major:";
  const prefer_minor_q = setup?"Choose your minor(s):":"Your minor(s):";
  const start_term_q = setup?"When did you start school at Purdue?":"Your start date:";
  const end_term_q = setup?"Expected graduation date:":"Your expected graduation date:";
  const submit_button_text = setup?"Submit":"Edit/Save";
  const navigate = useNavigate();
  // console.log(userinfo);

  const submit = () => {
    var go = true;
    if (!userinfo.prefer_majors || !userinfo.prefer_majors.length) {
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
      // console.log(userinfo); // for testing purposes
      if (currentUser) {
        const uid = currentUser.uid;
        const user_doc = doc(firestore, "users", uid);
        updateDoc(user_doc, {
          prefer_majors: userinfo.prefer_majors,
          prefer_minor: userinfo.prefer_minor,
          user_type: userinfo.user_type,
          start_term: Timestamp.fromDate(new Date(userinfo.start_term)),
          end_term: Timestamp.fromDate(new Date(userinfo.end_term)),
        });
        (!setup && setUpdated(true));
        if (setup) navigate('/DegreePlanner');
      } else {
        (!setup && setUpdated(true));
        if (setup) navigate('/DegreePlanner');
      }
    }
  }

  return (
    <div>
      <Box className="Ctn">
        <FormControl display="flex" style={{width: 400}}>
          {!setup && <h3 className="Question">Name: {userinfo.name}</h3>}
          {!setup && <h3 className="Question">Email: {userinfo.purdue_email}</h3>}
          <h3 className="Question">{prefer_majors_q}</h3>
          <Autocomplete
          className="Input"
          multiple
          id="majors"
          options={major_data.majors}
          disableCloseOnSelect
          value={userinfo.prefer_majors}
          required={true}
          getOptionLabel={(option) => option.name}
          // isOptionEqualToValue={(option, value) => option.value === value.value}
          onChange = {(e, value) => {setUserinfo((previous) => ({...previous, prefer_majors: value}));
                                     setMissingMajor("");
                                     (!setup && setUpdated(false))}}
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
          <h3 className="Question">{prefer_minor_q}</h3>
          <Autocomplete
          className="Input"
          multiple
          id="minors"
          required={true}
          options={minor_data.minors}
          disableCloseOnSelect
          value={userinfo.prefer_minor}
          getOptionLabel={(option) => option.name}
          // isOptionEqualToValue={(option, value) => option.value === value.value}
          onChange = {(e, value) => {setUserinfo((previous) => ({...previous, prefer_minor: value}));
                                     (!setup && setUpdated(false))}}
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
          <h3 className="Question">{start_term_q}</h3>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              sx={{ mt: "1em", mb: "2em"}}
              label="Select start date *"
              shouldDisableYear={validStartYear}
              value={userinfo.start_term}
              onChange = {(value) => {setUserinfo((previous) => ({...previous, start_term: value}));
                                      setStart("");
                                      (!setup && setUpdated(false))}}
              slotProps={{
                textField: {
                  error: start && start.length?true:false,
                  helperText: start,
                },
              }}
            />
            <h3 className="Question">{end_term_q}</h3>
            <DatePicker
              sx={{ mt: "1em", mb: "2em"}}
              label="Select end date *"
              shouldDisableYear={validEndYear}
              value={userinfo.end_term}
              onChange = {(value) => {setUserinfo((previous) => ({...previous, end_term: value}));
                                      setEnd("");
                                      (!setup && setUpdated(false))}}
              slotProps={{
                textField: {
                  error: end && end.length?true:false,
                  helperText: end,
                },
              }}
            />
          </LocalizationProvider>
        </FormControl>
        <FormControl display="flex" style={{width: 400}}>
          {!setup && <h3 className="Question">Your advisor: {userinfo.advisor}</h3>}
        </FormControl>
        <Box className="Btn">
          <Button type="submit" onClick={handleSubmit(submit)} variant="outlined">{submit_button_text}</Button>
          {!setup && <Button sx={{mt: "0.5em"}} type="submit" className="Btn" href='/DegreePlanner' variant="outlined">Back to home</Button>}
        </Box>
      </Box>
    </div>
  )
}

export default Student_profile
