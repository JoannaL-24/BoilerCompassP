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
  return (
    <div>
      <h1 className="paget">Profile Setup</h1>
      <Box className="Ctn" style={{ height: "30vh" }}>
      {/* <FormControl display="flex" style={{width: 400}}>
      <h3 align="left" className="Question">Choose your major:</h3>
        <InputLabel sx={{mt: "4.8em"}} id="major">Select one or more</InputLabel>
        <Select
          labelId="major"
          // id="demo-simple-select"
          // value={age}
          sx={{ mt: "1em" }}
          label="Select one or more"
          // multiple
          // onChange={handleChange}
        >
          {major_data.majors.map(major => (
            <MenuItem value={major.name} key={major.name}>{major.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl display="flex" style={{width: 400}}>
      <h3 align="left" className="Question">Select your minor:</h3>
        <InputLabel sx={{mt: "4.8em"}} id="minor">Select one or more</InputLabel>
        <Select
          labelId="minor"
          // id="demo-simple-select"
          // value={age}
          sx={{ mt: "1em" }}
          default="N/A"
          label="Select one or more"
          // multiple
          // onChange={handleChange}
        >
          {minor_data.minors.map(minor => (
            <MenuItem value={minor.name} key={minor.name}>{minor.name}</MenuItem>
          ))}
        </Select>
      </FormControl> */}
      <FormControl display="flex" style={{width: 400}}>
        <Autocomplete
        multiple
        id="majors"
        options={major_data}
        disableCloseOnSelect
        getOptionLabel={(option) => option.name}
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
        style={{ width: 500 }}
        renderInput={(params) => (
          <TextField {...params} label="Select one or more" placeholder="Select one or more" />
        )}
      />
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
