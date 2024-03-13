import "./ScheduleSide.css";
import React, { useState } from "react";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ClassIcon from '@mui/icons-material/Class';
import SchoolIcon from '@mui/icons-material/School';
import Searchbar from '../Searchbar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import DarkModeToggle from '../DarkModeToggle/DarkModeToggle';
//import "./Sidebar.css"

const drawerWidth = 240;

export default function SceduleSide() {


  const theme = createTheme({
    palette: {
      mode: "dark",
      darkTheme: {
        textPrimary: '#ffffff',
        textSecondary: '#d7c494',
        accent: '#79704c',
      }
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <div className='Sidebar' style={{ width: "100%" }}>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <Drawer
            variant="permanent"
            anchor="right"
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              [`& .MuiDrawer-paper`]:
              {
                width: drawerWidth,
                top: 'calc(55px + 2vh)',
                zIndex: 100,
                boxSizing: 'border-box'
              },

            }}
          >
            {/* <Toolbar /> */}
            <Box sx={{ overflow: 'auto' }}>
              <List>
                {['Courses', 'Requirements'].map((text, index) => (
                  <ListItem key={text} disablePadding>
                    <ListItemButton>
                      <ListItemIcon>
                        {index % 2 === 0 ? <ClassIcon /> : <SchoolIcon />}
                      </ListItemIcon>
                      <ListItemText primary={text} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
            <Searchbar />
          </Drawer>
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Toolbar />
          </Box>
        </Box>
      </div>
    </ThemeProvider>

  );
}
