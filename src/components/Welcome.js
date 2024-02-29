import React, { useState } from 'react';
import Box from '@mui/system/Box';
import Button from '@mui/material/Button';
import '../css/Profile.css';

const Welcome = () => {
  const [welcome, setWelcome] = useState(true);

  return (
    <div>
      <Box className="Ctn" style={{ display: welcome? 'flex':'none', height: "100vh" }}>
        <h1 className="title" variant="h1">Welcome</h1>
        <h2>Answer a few questions to get you started</h2>
        <Box>
          <Button className="Btn" onClick={() => setWelcome(false)} sx={{ mt: 3}} variant="outlined">Start</Button>
        </Box>
      </Box>
      <Box className="Ctn" style={{ display: welcome? 'none' : 'flex', height: "100vh" }}>
      <h2 style={{ fontSize: "3em" }} variant="h1">Select your role:</h2>
      <Box>
        <Button href="/profile-setup-student" className="Btn" sx={{ mt: 3}} variant="contained" size="large">Student</Button>
      </Box>
      <Box>
        <Button href="/profile-setup-advisor" className="Btn" sx={{ mt: 3}} variant="contained" size="large" >Advisor</Button>
      </Box>
    </Box>
  </div>
  )
}

export default Welcome