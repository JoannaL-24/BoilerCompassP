import "./NavBar.css"
import React, { useState } from "react";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import DarkModeToggle from "../DarkModeToggle/DarkModeToggle";


const options = [
  'None',
  'Atria',
  'Callisto',
  'Dione',
  'Ganymede',
  'Hangouts Call',
  'Luna',
  'Oberon',
  'Phobos',
  'Pyxis',
  'Sedna',
  'Titania',
  'Triton',
  'Umbriel',
];

const ITEM_HEIGHT = 48;

type Props = {
  darkmode:boolean;
  setDarkmode: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function NavBar({darkmode, setDarkmode}: Props) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // console.log(setDark_mode)
  // console.log("==========")
  // console.log(darkmode)
  // console.log(typeof(darkmode))
  // setDarkmode(false)
  // console.log(darkmode)


  return (
    <div className="navBarContainer">
      <img src="/logo/BoilerCompass Logo (Transparent).png" alt="Boiler Compass"></img>
      <ul className="navBtnList">
        <li className="navBtnList"
        >
          <a
            aria-label="more"
            id="long-button"
            aria-controls={open ? 'long-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleClick}
          >
            <h3>Schedule</h3>
          </a>
        </li>
        <li className="navBtnList">
          <a>
            <h3>Groups</h3>
          </a>
        </li>
        <li className="navBtnList">
          <DarkModeToggle 
            darkmode = {darkmode}
            setDarkmode = {setDarkmode}/>
        </li>
        <li className="navBtnList">
          <a>
            <h3>A</h3>
          </a>
        </li>
      </ul>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch',
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option} selected={option === 'Pyxis'} onClick={handleClose}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}