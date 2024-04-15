import "./NavBar.css";
import React, { useEffect, useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import DarkModeToggle from "../DarkModeToggle/DarkModeToggle";
import Stack from "@mui/material/Stack";
import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";
import HomeIcon from "@mui/icons-material/Home";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { firestore } from "models/firebase";

const options = ["Schedule1", "Schedule2", "Schedule3"];

const ITEM_HEIGHT = 48;

type Props = {
  darkmode: boolean;
  setDarkmode: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function NavBar({
  darkmode,
  setDarkmode,
  schedules,
  createNewSchedule,
  viewOnly,
}) 
{
  const [userType, setUserType] = useState("");
  const [scheduleInfo, setScheduleInfo] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [homeAnchorEl, setHomeAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const homeOpen = Boolean(homeAnchorEl);
  const handleHomeClick = (event: React.MouseEvent<HTMLElement>) => {
    setHomeAnchorEl(event.currentTarget);
  };
  const handleHomeClose = () => {
    setHomeAnchorEl(null);
  };

  const { currentUser, signUserOut } = useAuth();
  const navigate = useNavigate();
  const userSignOut = () => {
    signUserOut()
      .then(() => {
        console.log("sign out successful");
        handleHomeClose();
        navigate("/");
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    if (currentUser) {

      getDoc(doc(firestore, "users", currentUser.uid))
        .then((userSnap) => {
          if (userSnap.exists()) {
            setUserType(userSnap.data().user_type);
          } else {
            console.log("User data not found");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, [currentUser]);

  // TODO: fix this & get back schdule list
  useEffect(() => {
    if (userType !== "student") return;
    if (schedules.list.length <= 0) return;
    let newScheduleName = [];
    for (let i = 0; i < schedules.list.length; i++) {
      getDoc(doc(firestore, "schedules", schedules.list[i]))
        .then((scheduleSnap) => {
          console.log(scheduleSnap.data());
          newScheduleName[i] = scheduleSnap.data().name;
          setScheduleInfo([...newScheduleName]); // Update state with new schedule names
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [userType, schedules.list]);

  return (
    <div className="navBarContainer">
      <img
        src="/logo/BoilerCompass Logo (Transparent).png"
        alt="Boiler Compass"
      ></img>
      <ul className="navBtnList">
        {userType === "student" && (
          <li className="navBtnList">
            <a
              aria-label="more"
              id="long-button"
              aria-controls={open ? "long-menu" : undefined}
              aria-expanded={open ? "true" : undefined}
              aria-haspopup="true"
              onClick={handleClick}
            >
              <h3>Schedule</h3>
            </a>
          </li>
        )}

        {userType === "student" && (
          <li className="navBtnList">
            <a>
              <h3>Groups</h3>
            </a>
          </li>
        )}

        <li className="navBtnList">
          <DarkModeToggle darkmode={darkmode} setDarkmode={setDarkmode} />
        </li>
        <li className="navBtnList">
          {/* work inside here */}
          <div>
            <Button
              aria-controls={homeOpen ? "home-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={homeOpen ? "true" : undefined}
              onClick={handleHomeClick}
            >
              <HomeIcon />
            </Button>
            <Menu
              id="home-menu"
              anchorEl={homeAnchorEl}
              open={homeOpen}
              onClose={handleHomeClose}
            >
              <MenuItem onClick={handleHomeClose}>
                <Link
                  to="/Profile"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  Profile
                </Link>
              </MenuItem>
              <MenuItem>
                <Link
                  to={{
                    pathname: "/settings",
                  }}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  Settings
                </Link>
              </MenuItem>

              {/* <MenuItem onClick={handleHomeClose}>Settings</MenuItem> */}
              <MenuItem onClick={userSignOut}>Logout</MenuItem>
            </Menu>
          </div>
        </li>
      </ul>
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: "20ch",
          },
        }}
      >
        {scheduleInfo.map((name, index) => (
          <MenuItem key={index} onClick={handleClose}>
            {name}
          </MenuItem>
        ))}
        <p>------------------------------</p>
        <MenuItem onClick={createNewSchedule}>New Schedule +</MenuItem>
      </Menu>
    </div>
  );
}
