import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/system/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Checkbox from '@mui/material/Checkbox';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import major_data from '../json/majors.json';
import minor_data from '../json/minors.json';
import '../css/Profile.css';

const Profile_setup = () => {
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const [userinfo, setUserinfo] = useState({
    role: "advisor",
    college: "",
    department: "",

  });

  const handleSubmit = (e) => {
    console.log(userinfo);
  };

  return (
    <div>
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

        <Box className="Btn">
          <Button onClick={handleSubmit} variant="outlined">Submit</Button>
        </Box>
      </Box>
    </div>
  )
}

export default Profile_setup
