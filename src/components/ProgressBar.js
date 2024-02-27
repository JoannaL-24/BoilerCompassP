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
      // dark: 'rgb(198, 198, 198)',
      main: '#CEB888',
      // light: 'rgba(225, 225, 225, 0.388)',
    },
  },
});

const LinearProgressWithLabel = (props) => {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', alignItems: 'center' }} >
        <Box sx={{ display: 'flex', minWidth: 130 }}>
          <Typography variant="body2" color="text.secondary">Degree progress:</Typography>
        </Box>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress
          variant="buffer"
          {...props}
          color="barColor"
          size="1em"
          sx={{"& .MuiLinearProgress-dashed": {
            // backgroundColor: "lightgrey",
            // backgroundImage: "none",
            animation: "none",
            size: "1em"
          }}}/>
        </Box>
        <Box sx={{ display: 'flex', minWidth: 250 }}>
          <Typography variant="body2" color="text.secondary">{`Completed: ${Math.round(props.value,)}%`}</Typography>
          <Typography variant="body2" color="text.secondary" marginLeft="1em">{`Planned: ${Math.round(props.valueBuffer,)}%`}</Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

LinearProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate and buffer variants.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
};

const ProgressBar = (numbers) => {
  // get the total number of requirements the user has completed from the database here
  // total number of requirements that needs to be satisfied
  // set progress to be {have completed / total requirements}
  const [completedReq, setCompletedReq] = useState(parseInt(numbers.completed));
  const [totalReq, setTotalReq] = useState(parseInt(numbers.total));

  return (
    <Box sx={{ marginLeft: "120px",  marginRight: "120px", width: "80%", marginTop: "1.5em"}}>
      <LinearProgressWithLabel value={(completedReq/totalReq)*100} valueBuffer={50}/>
    </Box>
  );
}

export default ProgressBar