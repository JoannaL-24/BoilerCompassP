import React from 'react'
import Typography from '@mui/material/Typography';
import Box from '@mui/system/Box';
import Button from '@mui/material/Button';

const Welcome = () => {
  return (
    <Box display="flex" justifyContent="center" flexDirection="column" style={{ height: "100vh" }}>
      <Typography className="title" variant="h1" color="black">Welcome</Typography>
      <Typography variant="h6" color="black">Answer a few questions to get you started</Typography>
      <Box>
        <Button sx={{mt: 3}} variant="button" variant="outlined">Start</Button>
      </Box>
    </Box>
  )
}

export default Welcome
