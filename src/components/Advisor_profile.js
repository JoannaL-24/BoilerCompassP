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
import college_data from '../json/colleges.json';
import '../css/Profile.css';

const Advisor_profile = ({userinfo, setUserinfo, handleSubmit}) => {
  return (
    <div>
    <Box className="Ctn">
    <FormControl display="flex" style={{width: 400}}>
      <h3 className="Question">Choose your college:</h3>
      <Autocomplete
      className="Input"
      id="colleges"
      options={college_data.colleges}
      disableCloseOnSelect
      getOptionLabel={(option) => option.name}
      onChange = {(e, value) => setUserinfo((previous) => ({...previous, college: value}))}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          {option.name}
        </li>
      )}
      renderInput={(params) => (
        <TextField {...params}
        label="Select"
        placeholder="Select"
        required={true}
        />
      )}
    />
    </FormControl>
    <FormControl display="flex" style={{width: 400}}>
      <h3 className="Question">Choose your department:</h3>
      <Autocomplete
      className="Input"
      id="department"
      options={major_data.majors}
      disableCloseOnSelect
      getOptionLabel={(option) => option.name}
      onChange = {(e, value) => setUserinfo((previous) => ({...previous, department: value}))}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          {option.name}
        </li>
      )}
      renderInput={(params) => (
        <TextField {...params}
        label="Select"
        placeholder="Select"
        required={true}
        />
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

export default Advisor_profile
