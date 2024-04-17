import React, {
  useState,
  useEffect,
  useMemo,
  CSSProperties,
  Component,
  useReducer,
} from "react";
import { Wave, Random } from "react-animated-text";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import AccountCircle from "@mui/icons-material/AccountCircle";
import firebase from "firebase/app";
import { initializeApp } from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { getDoc, query, where, doc, updateDoc } from "firebase/firestore";
import { firestore } from "../models/firebase.ts";
import "firebase/firestore";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import "./AdvisorHomepageFilter.css";
import app from "../models/firebase.ts";
import { useAuth } from "../components/contexts/AuthContext";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DisplayStudentSchedule from "./DisplayStudentSchedule";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

function AdvisorHomepageFilter() {
  const [viewButtonClicked, setViewButtonClicked] = useState(false);
  const [value, setValue] = useState("female");
  const [userNames, setUserNames] = useState<
    {
      uid: string;
      name: string;
      start_term: any;
      purdue_email: string;
      prefer_majors: { name: string }[];
    }[]
  >([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [clickedUser, setClickedUser] = useState(null);
  const [hoveredUser, setHoveredUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);
  const [clickedLabel, setClickedLabel] = useState(null);
  const [list, setList] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false); // dialog open/close
  const [studentEmail, setStudentEmail] = useState("");
  const [currentUserGroups, setCurrentUserGroups] = useState<string[]>([]); //get the group of current user
  const [studentEmails, setStudentEmails] = useState([""]); // store student emails
  const [currentUserGroupsLength, setCurrentUserGroupsLength] = useState(0); //length of currentUserGroups array
  const [studentSchedule, setStudentSchedule] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [scheduleInfo, setScheduleInfo] = useState(null);

  const handleOpen = () => {
    setViewButtonClicked(true);
  };

  const handleClose = () => {
    setViewButtonClicked(false);
  };

  // useEffect(() => {
  //   setCurrentUserGroupsLength(currentUserGroups.length);
  // }, [currentUserGroups]);

  //const lengthOfCurrentUserGroups = currentUserGroupsLength; //unneccessary, can interchange with currentusergroups.length

  // Add a state variable to hold the sorting option
  const [sortingOption, setSortingOption] = useState(null);

  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchUserGroups = async () => {
      if (currentUser) {
        const userDocRef = doc(firestore, "users", currentUser.uid);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          setCurrentUserGroups(userData.groups || []); // Set groups or empty array
        }
      }
    };

    fetchUserGroups();
  }, [currentUser]);

  const textStyle = {
    //result not found
    //display: "inline-block",

    marginBottom: "1em",
    padding: "2em 1em 1em 1em",
    width: "80%",
    fontSize: "2rem",
  };

  const noonetextstyle: CSSProperties = {
    position: "fixed",
    marginTop: "2em",
    //top: "40%",
    left: "35%",
    //transform: "translate(-50%, -50%)",
    zIndex: "999",
    overflow: "scroll",
    fontSize: "3rem",
  };

  const codeDivStyle = {
    marginTop: "2em",
    padding: "1px 1em",
    overflow: "scroll",
    fontSize: "2rem",
  };

  const Wave1 = () => (
    <div style={textStyle}>
      <Wave
        text="NO RESULTS FOUND"
        effect="fadeOut"
        effectChange={0.1}
        effectDuration={0.01}
      />

      <div style={codeDivStyle}></div>
    </div>
  );

  const Wave2 = () => (
    <div style={noonetextstyle}>
      <Wave
        text="You have no students"
        effect="fadeOut"
        effectChange={0.1}
        effectDuration={0.01}
      />

      <div style={codeDivStyle}></div>
    </div>
  );

  useEffect(() => {
    const firestore = getFirestore(app);
    const fetchUserNames = async () => {
      const usersSnapshot = await getDocs(collection(firestore, "users"));
      const usersData: {
        uid: string;
        name: string;
        purdue_email: string;
        prefer_majors: { name: string }[];
        user_type: string;
        start_term: any;
      }[] = [];
      usersSnapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData.user_type === "student") {
          usersData.push({
            uid: doc.id,
            name: userData.name,
            purdue_email: userData.purdue_email,
            prefer_majors: userData.prefer_majors || [],
            user_type: userData.user_type,
            start_term: userData.start_term,
          });
        }
      });
      setUserNames(usersData);
    };

    fetchUserNames();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    setSortingOption(event.target.value); // Set the sorting option
  };

  const handleUserClick = (userData: any) => {
    setSelectedUser(userData);
    setClickedUser(userData);
    setPopupVisible(true);
    setClickedLabel(userData);
    setTimeout(() => {
      setClickedUser(null);
    }, 50); // time
  };

  const handleCloseButtonClick = () => {
    setPopupVisible(false);
    setTimeout(() => {
      setSelectedUser(null);
    }, 500); // timeout to match animation
  };

  const filteredUserNames = userNames.filter((user) => {
    const query = searchQuery?.toLowerCase() || "";
    console.log("user:", user);
    console.log("query:", query);
    console.log("user.name:", user.name);
    console.log("user.purdue_email:", user.purdue_email);
    console.log("user.prefer_majors:", user.prefer_majors);

    return (
      user.name.toLowerCase().includes(query) ||
      (user.start_term &&
        getSemester(user.start_term.toDate()) // Check semester
          .toLowerCase()
          .includes(query)) ||
      user.purdue_email.toLowerCase().includes(query) ||
      user.prefer_majors.some((major) =>
        major.name.toLowerCase().includes(query)
      )
    );
  });

  // sort based on options
  const sortedUserNames = useMemo(() => {
    let sortedUsers = [...filteredUserNames];
    switch (sortingOption) {
      case "alphabetincrease":
        sortedUsers.sort((a, b) => a.name.localeCompare(b.name)); // sort alphabetically in ascending order
        break;
      case "alphabetdecrease":
        sortedUsers.sort((a, b) => b.name.localeCompare(a.name)); // sort alphabetically in descending order
        break;
      case "yearincrease":
        sortedUsers.sort((a, b) => {
          const yearA = a.start_term && a.start_term.toDate().getFullYear();
          const yearB = b.start_term && b.start_term.toDate().getFullYear();
          if (yearA !== yearB) {
            return yearA - yearB; // year in ascending order
          } else {
            // compare semester spring before fall
            const semesterA = getSemester(a.start_term.toDate());
            const semesterB = getSemester(b.start_term.toDate());
            if (semesterA === semesterB) return 0;
            return semesterA < semesterB ? 1 : -1;
          }
        });
        break;
      case "yeardecrease":
        sortedUsers.sort((a, b) => {
          const yearA = a.start_term && a.start_term.toDate().getFullYear();
          const yearB = b.start_term && b.start_term.toDate().getFullYear();
          if (yearA !== yearB) {
            return yearB - yearA; // year descending
          } else {
            //compare semester
            const semesterA = getSemester(a.start_term.toDate());
            const semesterB = getSemester(b.start_term.toDate());
            if (semesterA === semesterB) return 0;
            return semesterA < semesterB ? -1 : 1;
          }
        });
        break;
      // Add other sorting options here if needed
      default:
        break;
    }
    return sortedUsers;
  }, [filteredUserNames, sortingOption]);

  function getSemester(date: Date) {
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    if (month >= 1 && month <= 6) {
      return "Spring " + year;
    } else if (month >= 7 && month <= 12) {
      return "Fall " + year;
    }
    return "";
  }

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setStudentEmails([""]); // Reset student emails to one empty field
  };

  const forceUpdate = useReducer((bool) => !bool, false)[1];

  // Function to handle adding a student
  const handleAddStudent = async () => {
    const emails = studentEmails.filter((email) => email.trim() !== "");
    const db = getFirestore(app);
    const groupsToUpdate = [];

    for (const email of emails) {
      try {
        // find the user with the current email
        const querySnapshot = await getDocs(
          query(collection(db, "users"), where("purdue_email", "==", email))
        );

        // check email exists
        if (!querySnapshot.empty) {
          // get the UID of the user and add it to the groupsToUpdate array
          querySnapshot.forEach((doc) => {
            groupsToUpdate.push(doc.id);
          });
        }
      } catch (error) {
        console.error("Error searching for user:", error);
      }
    }

    // Update the groups array with the UIDs of the found users
    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      await updateDoc(userDocRef, {
        groups: currentUserGroups.concat(groupsToUpdate),
      });
      console.log("Groups updated successfully");
      setCurrentUserGroups((prevGroups) => [...prevGroups, ...groupsToUpdate]); //IMPORTANT
      // setCurrentUserGroupsLength(
      //   currentUserGroups.length + groupsToUpdate.length
      // );
      //forceUpdate(); // Force re-render to counter async  //maybe not needed?
    } catch (error) {
      console.error("Error updating groups:", error);
    }

    /*emails.forEach((email) => {
      console.log(email);  //test
    });*/

    handleDialogClose();

    currentUserGroups.forEach((u) => {
      console.log("now array has " + u); /*test */
      console.log("wtf");
    });
  };

  const handleChangeEmail = (index, value) => {
    const newEmails = [...studentEmails];
    newEmails[index] = value;
    setStudentEmails(newEmails);
  };

  // Function to handle adding a student email field
  const handleAddEmailField = () => {
    setStudentEmails([...studentEmails, ""]);
  };

  const handleRemoveEmailField = () => {
    if (studentEmails.length > 1) {
      const newEmails = [...studentEmails];
      newEmails.pop();
      setStudentEmails(newEmails);
    }
  };

  return (
    <div className="AddsivorHomePageFilter">
      {
        /*lengthOfCurrentUserGroups !== 0*/ currentUserGroups.length !== 0 && ( //CHECK
          <div className="studentSearching">
            <div>
              <AccountCircle sx={{ color: "action.active", mr: 1, my: 0.5 }} />
              <TextField
                id="input-with-sx"
                label="Search student"
                variant="standard"
                style={{ width: "201px" }}
                onChange={(e) => setSearchQuery(e.target.value)} // update search state
              />
            </div>
            <br />
            <FormControl
              sx={{
                border: "2px solid var(--textPrimary)",
                borderRadius: "5px",
                padding: "10px",
              }}
            >
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={sortingOption}
                onChange={handleChange}
                //onChange={(e) => setSortingOption(e.target.value)}
              >
                <FormControlLabel
                  className="radio-group-shadow"
                  value="default"
                  control={
                    <Radio
                      sx={{
                        "& .MuiSvgIcon-root": {
                          fontSize: 35,
                        },
                      }}
                    />
                  }
                  label="Reset"
                />
                <FormControlLabel
                  className="radio-group-shadow"
                  value="alphabetincrease"
                  control={
                    <Radio
                      sx={{
                        "& .MuiSvgIcon-root": {
                          fontSize: 35,
                        },
                      }}
                    />
                  }
                  label="Sort alphabetically (ascending)"
                />
                <FormControlLabel
                  className="radio-group-shadow"
                  value="alphabetdecrease"
                  control={
                    <Radio
                      sx={{
                        "& .MuiSvgIcon-root": {
                          fontSize: 35,
                        },
                      }}
                    />
                  }
                  label="Sort alphabetically (descending)"
                />
                <FormControlLabel
                  className="radio-group-shadow"
                  value="yearincrease"
                  control={
                    <Radio
                      sx={{
                        "& .MuiSvgIcon-root": {
                          fontSize: 35,
                        },
                      }}
                    />
                  }
                  label="Sort by year (ascending)"
                />
                <FormControlLabel
                  className="radio-group-shadow"
                  value="yeardecrease"
                  control={
                    <Radio
                      sx={{
                        "& .MuiSvgIcon-root": {
                          fontSize: 35,
                        },
                      }}
                    />
                  }
                  label="Sort by year (descending)"
                />
              </RadioGroup>
            </FormControl>
            <Button
              variant="contained"
              style={{
                marginTop: "20px", // Adjust margin top for spacing
                backgroundColor: "#1976d2",
              }}
              onClick={handleDialogOpen}
            >
              Add More Students
            </Button>
          </div>
        )
      }

      {
        /*lengthOfCurrentUserGroups !== 0*/ currentUserGroups.length !==
          0 /*CHECK*/ && (
          <div className="searchResult">
            {(sortingOption && sortedUserNames.length === 0) ||
            filteredUserNames.length === 0 ? (
              <Wave1 />
            ) : (
              <React.Fragment>
                {sortingOption
                  ? sortedUserNames
                      .filter((user) => currentUserGroups.includes(user.uid))
                      .map((user, index) => (
                        <a
                          key={index}
                          href="#"
                          onClick={() => handleUserClick(user)}
                          onMouseEnter={() => setHoveredUser(user)}
                          onMouseLeave={() => setHoveredUser(null)}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            textDecoration: "none",
                            borderRadius: "20px",
                            width: "160px",
                            padding: "10px",
                            marginRight: "50px",
                            marginBottom: "10px",
                            transform: `${
                              clickedUser === user ? "scale(0.3)" : "scale(1)"
                            } ${
                              hoveredUser === user ? "scale(1.2)" : "scale(1)"
                            }`,
                            transition: "transform 0.5s ease",
                            backgroundColor:
                              hoveredUser === user ? "#87ceeb" : "",
                            color: hoveredUser === user ? "white" : "",
                            boxShadow:
                              hoveredUser === user
                                ? "10px 10px 20px rgba(128, 229, 216, 1)"
                                : "",
                            border:
                              hoveredUser === user
                                ? "1px solid white"
                                : "1px solid var(--textPrimary)",
                          }}
                        >
                          <AccountCircle
                            sx={{ color: "action.active", fontSize: "40px" }}
                          />
                          <span style={{ marginTop: "5px" }}>{user.name}</span>{" "}
                        </a>
                      ))
                  : filteredUserNames
                      .filter((user) => currentUserGroups.includes(user.uid))
                      .map((user, index) => (
                        <a
                          key={index}
                          href="#"
                          onClick={() => handleUserClick(user)}
                          onMouseEnter={() => setHoveredUser(user)}
                          onMouseLeave={() => setHoveredUser(null)}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            textDecoration: "none",
                            borderRadius: "20px",
                            width: "160px",
                            padding: "10px",
                            marginRight: "50px",
                            marginBottom: "10px",
                            transform: `${
                              clickedUser === user ? "scale(0.3)" : "scale(1)"
                            } ${
                              hoveredUser === user ? "scale(1.2)" : "scale(1)"
                            }`,
                            transition: "transform 0.5s ease",
                            backgroundColor:
                              hoveredUser === user ? "#87ceeb" : "",
                            color: hoveredUser === user ? "white" : "",
                            boxShadow:
                              hoveredUser === user
                                ? "10px 10px 20px rgba(128, 229, 216, 1)"
                                : "",
                            border:
                              hoveredUser === user
                                ? "1px solid white"
                                : "1px solid var(--textPrimary)",
                          }}
                        >
                          <AccountCircle
                            sx={{ color: "action.active", fontSize: "40px" }}
                          />
                          <span style={{ marginTop: "5px" }}>{user.name}</span>{" "}
                        </a>
                      ))}
              </React.Fragment>
            )}
          </div>
        )
      }

      {/* Popup to display user data */}
      {selectedUser && (
        <div
          className="popup-window"
          style={{
            position: "fixed",

            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            //backgroundColor: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",

            animation: "dropTop 0.5s linear",
            backgroundColor: "#87ceeb",
          }}
        >
          <button
            onClick={() => {
              const popupWindow = document.querySelector(
                ".popup-window"
              ) as HTMLElement;
              if (popupWindow) {
                popupWindow.style.animation = "dropBottom 0.5s linear";
              }
              setTimeout(() => setSelectedUser(null), 500);
            }}
            style={{
              position: "fixed",
              top: "10px",
              right: "10px",
              padding: "3px 8px",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Close
          </button>
          <h2 style={{ paddingTop: "20px" }}>User Details</h2>
          <p>Name: {selectedUser.name}</p>
          <p>
            Start Year:{" "}
            {
              selectedUser.start_term &&
                getSemester(selectedUser.start_term.toDate()) // check semester
            }
          </p>
          <p>Email: {selectedUser.purdue_email}</p>
          <p>Prefer Majors:</p>
          <ul>
            {selectedUser.prefer_majors.map(
              (major: { name: string }, index: number) => (
                <li key={index} style={{ textAlign: "left" }}>
                  {major.name}
                </li>
              )
            )}
          </ul>
          <Button
            variant="contained"
            onClick={() => setViewButtonClicked(true)} //VIEW SCHEDULE
            style={{
              marginTop: "10px",
              color: "#003fce",
              backgroundColor: "#879DEB",
            }}
          >
            View Schedule
          </Button>
          <Modal
            open={viewButtonClicked}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <div
              style={{
                position: "fixed",

                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                //backgroundColor: "white",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",

                animation: "dropTop 0.5s linear",
                backgroundColor: "white",
              }}
            >
              <DisplayStudentSchedule selectedUser={selectedUser} />

              <Button
                onClick={handleClose}
                style={{
                  position: "fixed",
                  top: "10px",
                  right: "10px",
                  padding: "3px 8px",
                  borderRadius: "5px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {" "}
                Close
              </Button>
            </div>
          </Modal>
        </div>
      )}
      {/* Dialog for adding a student */}
      {
        <Dialog open={dialogOpen} onClose={handleDialogClose}>
          <DialogTitle>Add Student</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter the email of the student(s) you want to add:
            </DialogContentText>
            {studentEmails.map((email, index) => (
              <div key={index}>
                <TextField
                  margin="dense"
                  label={`Student Email ${index + 1}`}
                  type="email"
                  fullWidth
                  value={email}
                  onChange={(e) => handleChangeEmail(index, e.target.value)}
                />
                {index === studentEmails.length - 1 && (
                  <Button
                    style={{ marginLeft: "200px" }}
                    onClick={handleAddEmailField}
                  >
                    <PersonAddIcon />
                  </Button>
                )}
              </div>
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button onClick={handleAddStudent}>OK</Button>
          </DialogActions>
        </Dialog>
      }

      {/*Button when group is empty */}
      {
        /*lengthOfCurrentUserGroups === 0*/ currentUserGroups.length === 0 && ( // CHECK
          <div>
            {console.log("empty array")}
            <Wave2 />
            <Button
              variant="contained"
              //color="primary"
              style={{
                position: "fixed",
                marginTop: "18em",
                left: "46%",

                backgroundColor: "#1976d2",
              }}
              onClick={handleDialogOpen}
            >
              Add Students
            </Button>
          </div>
        )
      }
    </div>
  );
}
export default AdvisorHomepageFilter;

//https://www.npmjs.com/package/react-type-animation
//https://yidaoj.github.io/react-moving-text/
