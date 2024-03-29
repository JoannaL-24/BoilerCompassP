import * as React from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    barColor: {
      main: '#CEB888',
    },
    mainGold: {
      main: "#daaa00"
    }
  },
});

const LinearProgressWithLabel = (props) => {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', alignItems: 'center' }} >
        <Box sx={{ display: 'flex', minWidth: 125 }}>
          <Typography className="label" variant="body2" color="#CEB888">Degree Progress:</Typography>
        </Box>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress
          variant="buffer"
          {...props}
          color="barColor"
          sx={{"& .MuiLinearProgress-dashed": {
            animation: "none",
            display: "flex",
          }}}/>
        </Box>
        <Box sx={{ marginLeft: "0.3em", display: 'flex', minWidth: 250 }}>
          <Typography className="label" variant="body2" color="#CEB888">{`Completed: ${Math.round(props.value,)}%`}</Typography>
          <Typography className="label" variant="body2" color="#CEB888" marginLeft="1em">{`Planned: ${Math.round(props.valueBuffer,)}%`}</Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

LinearProgressWithLabel.propTypes = {
  value: PropTypes.number.isRequired,
};

const ProgressBar = ({completed, planned, total}) => {
  // get the total number of requirements the user has completed from the database here
  // total number of requirements that needs to be satisfied
  // set progress to be {have completed / total requirements}
  // console.log("wow")
  // console.log(completed);
  // console.log(planned);
  // console.log(total);
  return (
    <Box sx={{ marginLeft: "120px",  marginRight: "120px", width: "80%", marginTop: "1.5em"}}>
      <LinearProgressWithLabel value={(completed/total)*100} valueBuffer={((planned+completed)/total)*100}/>
    </Box>
  );
}

export default ProgressBar