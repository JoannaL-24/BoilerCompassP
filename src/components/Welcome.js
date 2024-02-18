import React from 'react';
import Box from '@mui/system/Box';
import Button from '@mui/material/Button';
import '../css/Profile.css';

const Welcome = () => {
  return (
    <Box className="Ctn" style={{ height: "100vh" }}>
      <h1 className="title" variant="h1">Welcome</h1>
      <h2>Answer a few questions to get you started</h2>
      <Box>
        <Button className="Btn" sx={{mt: 3}} variant="button" variant="outlined">Start</Button>
      </Box>
    </Box>
  )
}

export default Welcome