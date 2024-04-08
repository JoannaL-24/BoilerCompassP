// import React, { useState, useEffect, useMemo } from "react";
// import { Wave, Random } from "react-animated-text";
// import Button from "@mui/material/Button";
// import ButtonGroup from "@mui/material/ButtonGroup";
// import Radio from "@mui/material/Radio";
// import RadioGroup from "@mui/material/RadioGroup";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import FormControl from "@mui/material/FormControl";
// import FormLabel from "@mui/material/FormLabel";
// import Box from "@mui/material/Box";
// import TextField from "@mui/material/TextField";
// import AccountCircle from "@mui/icons-material/AccountCircle";
// import firebase from "firebase/app";
// import { initializeApp } from "firebase/app";
// import "firebase/auth";
// import "firebase/firestore";
// import { doc, updateDoc } from "firebase/firestore";
// import { firestore } from "../models/firebase.ts";
// import "firebase/firestore";
// import { getFirestore, collection, getDocs } from "firebase/firestore";
// import "./AdvisorHomepageFilter.css";
// import app from "../models/firebase.ts";
// import { useAuth } from "../components/contexts/AuthContext";

// function AdvisorHomepageFilter() {
//   const [value, setValue] = useState("female");
//   const [userNames, setUserNames] = useState<
//     {
//       name: string;
//       start_term: any;
//       purdue_email: string;
//       prefer_majors: { name: string }[];
//     }[]
//   >([]);
//   const [selectedUser, setSelectedUser] = useState<any>(null);
//   const [clickedUser, setClickedUser] = useState(null);
//   const [hoveredUser, setHoveredUser] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [popupVisible, setPopupVisible] = useState(false);
//   const [clickedLabel, setClickedLabel] = useState(null);
//   const [list, setList] = useState(null);

//   // Add a state variable to hold the sorting option
//   const [sortingOption, setSortingOption] = useState(null);

//   const { currentUser } = useAuth();

//   const textStyle = {
//     //result not found
//     //display: "inline-block",

//     marginBottom: "1em",
//     padding: "2em 1em 1em 1em",
//     width: "80%",
//     fontSize: "2rem",
//   };

//   const codeDivStyle = {
//     marginTop: "2em",
//     padding: "1px 1em",
//     overflow: "scroll",
//     fontSize: "2rem",
//   };

//   const Wave1 = () => (
//     <div style={textStyle}>
//       <Wave
//         text="NO RESULTS FOUND"
//         effect="fadeOut"
//         effectChange={0.1}
//         effectDuration={0.01}
//       />

//       <div style={codeDivStyle}></div>
//     </div>
//   );

//   useEffect(() => {
//     const firestore = getFirestore(app);
//     const fetchUserNames = async () => {
//       const usersSnapshot = await getDocs(collection(firestore, "users"));
//       const usersData: {
//         name: string;
//         purdue_email: string;
//         prefer_majors: { name: string }[];
//         user_type: string;
//         start_term: any;
//       }[] = [];
//       usersSnapshot.forEach((doc) => {
//         const userData = doc.data();
//         if (userData.user_type === "student") {
//           usersData.push({
//             name: userData.name,
//             purdue_email: userData.purdue_email,
//             prefer_majors: userData.prefer_majors || [],
//             user_type: userData.user_type,
//             start_term: userData.start_term,
//           });
//         }
//       });
//       setUserNames(usersData);
//     };

//     fetchUserNames();
//   }, []);

//   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setValue(event.target.value);
//     setSortingOption(event.target.value); // Set the sorting option
//   };

//   const handleUserClick = (userData: any) => {
//     setSelectedUser(userData);
//     setClickedUser(userData);
//     setPopupVisible(true);
//     setClickedLabel(userData);
//     setTimeout(() => {
//       setClickedUser(null);
//     }, 50); // time
//   };

//   const handleCloseButtonClick = () => {
//     setPopupVisible(false);
//     setTimeout(() => {
//       setSelectedUser(null);
//     }, 500); // timeout to match animation
//   };

//   const filteredUserNames = userNames.filter((user) => {
//     const query = searchQuery?.toLowerCase() || "";
//     console.log("user:", user);
//     console.log("query:", query);
//     console.log("user.name:", user.name);
//     console.log("user.purdue_email:", user.purdue_email);
//     console.log("user.prefer_majors:", user.prefer_majors);

//     return (
//       user.name.toLowerCase().includes(query) ||
//       (user.start_term &&
//         getSemester(user.start_term.toDate()) // Check semester
//           .toLowerCase()
//           .includes(query)) ||
//       user.purdue_email.toLowerCase().includes(query) ||
//       user.prefer_majors.some((major) =>
//         major.name.toLowerCase().includes(query)
//       )
//     );
//   });

//   // sort based on options
//   const sortedUserNames = useMemo(() => {
//     let sortedUsers = [...filteredUserNames];
//     switch (sortingOption) {
//       case "alphabetincrease":
//         sortedUsers.sort((a, b) => a.name.localeCompare(b.name)); // sort alphabetically in ascending order
//         break;
//       case "alphabetdecrease":
//         sortedUsers.sort((a, b) => b.name.localeCompare(a.name)); // sort alphabetically in descending order
//         break;
//       case "yearincrease":
//         sortedUsers.sort((a, b) => {
//           const yearA = a.start_term && a.start_term.toDate().getFullYear();
//           const yearB = b.start_term && b.start_term.toDate().getFullYear();
//           if (yearA !== yearB) {
//             return yearA - yearB; // year in ascending order
//           } else {
//             // compare semester spring before fall
//             const semesterA = getSemester(a.start_term.toDate());
//             const semesterB = getSemester(b.start_term.toDate());
//             if (semesterA === semesterB) return 0;
//             return semesterA < semesterB ? 1 : -1;
//           }
//         });
//         break;
//       case "yeardecrease":
//         sortedUsers.sort((a, b) => {
//           const yearA = a.start_term && a.start_term.toDate().getFullYear();
//           const yearB = b.start_term && b.start_term.toDate().getFullYear();
//           if (yearA !== yearB) {
//             return yearB - yearA; // year descending
//           } else {
//             //compare semester
//             const semesterA = getSemester(a.start_term.toDate());
//             const semesterB = getSemester(b.start_term.toDate());
//             if (semesterA === semesterB) return 0;
//             return semesterA < semesterB ? -1 : 1;
//           }
//         });
//         break;
//       // Add other sorting options here if needed
//       default:
//         break;
//     }
//     return sortedUsers;
//   }, [filteredUserNames, sortingOption]);

//   function getSemester(date: Date) {
//     const month = date.getMonth() + 1;
//     const year = date.getFullYear();
//     if (month >= 1 && month <= 6) {
//       return "Spring " + year;
//     } else if (month >= 7 && month <= 12) {
//       return "Fall " + year;
//     }
//     return "";
//   }

//   return (
//     <div className="AddsivorHomePageFilter">
//       <div className="studentSearching">
//         <div>
//           <AccountCircle sx={{ color: "action.active", mr: 1, my: 0.5 }} />
//           <TextField
//             id="input-with-sx"
//             label="Search student"
//             variant="standard"
//             style={{ width: "201px" }}
//             onChange={(e) => setSearchQuery(e.target.value)} // update search state
//           />
//         </div>
//         <br />
//         <FormControl
//           sx={{
//             border: "2px solid var(--textPrimary)",
//             borderRadius: "5px",
//             padding: "10px",
//           }}
//         >
//           <RadioGroup
//             aria-labelledby="demo-controlled-radio-buttons-group"
//             name="controlled-radio-buttons-group"
//             value={sortingOption}
//             onChange={handleChange}
//             //onChange={(e) => setSortingOption(e.target.value)}
//           >
//             <FormControlLabel
//               className="radio-group-shadow"
//               value="default"
//               control={
//                 <Radio
//                   sx={{
//                     "& .MuiSvgIcon-root": {
//                       fontSize: 35,
//                     },
//                   }}
//                 />
//               }
//               label="Reset"
//             />
//             <FormControlLabel
//               className="radio-group-shadow"
//               value="alphabetincrease"
//               control={
//                 <Radio
//                   sx={{
//                     "& .MuiSvgIcon-root": {
//                       fontSize: 35,
//                     },
//                   }}
//                 />
//               }
//               label="Sort alphabetically (ascending)"
//             />
//             <FormControlLabel
//               className="radio-group-shadow"
//               value="alphabetdecrease"
//               control={
//                 <Radio
//                   sx={{
//                     "& .MuiSvgIcon-root": {
//                       fontSize: 35,
//                     },
//                   }}
//                 />
//               }
//               label="Sort alphabetically (descending)"
//             />
//             <FormControlLabel
//               className="radio-group-shadow"
//               value="yearincrease"
//               control={
//                 <Radio
//                   sx={{
//                     "& .MuiSvgIcon-root": {
//                       fontSize: 35,
//                     },
//                   }}
//                 />
//               }
//               label="Sort by year (ascending)"
//             />
//             <FormControlLabel
//               className="radio-group-shadow"
//               value="yeardecrease"
//               control={
//                 <Radio
//                   sx={{
//                     "& .MuiSvgIcon-root": {
//                       fontSize: 35,
//                     },
//                   }}
//                 />
//               }
//               label="Sort by year (descending)"
//             />
//           </RadioGroup>
//         </FormControl>
//       </div>

//       <div className="searchResult">
//         {(sortingOption && sortedUserNames.length === 0) ||
//         filteredUserNames.length === 0 ? (
//           <Wave1 />
//         ) : sortingOption ? (
//           sortedUserNames.map((user, index) => (
//             <a
//               key={index}
//               href="#"
//               onClick={() => handleUserClick(user)}
//               onMouseEnter={() => setHoveredUser(user)}
//               onMouseLeave={() => setHoveredUser(null)}
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//                 textDecoration: "none",
//                 borderRadius: "20px",
//                 width: "160px",
//                 padding: "10px",
//                 marginRight: "50px",
//                 marginBottom: "10px",
//                 transform: `${
//                   clickedUser === user ? "scale(0.3)" : "scale(1)"
//                 } ${hoveredUser === user ? "scale(1.2)" : "scale(1)"}`,
//                 transition: "transform 0.5s ease",
//                 backgroundColor: hoveredUser === user ? "#87ceeb" : "",
//                 color: hoveredUser === user ? "white" : "",
//                 boxShadow:
//                   hoveredUser === user
//                     ? "10px 10px 20px rgba(128, 229, 216, 1)"
//                     : "",
//                 border:
//                   hoveredUser === user
//                     ? "1px solid white"
//                     : "1px solid var(--textPrimary)",
//               }}
//             >
//               <AccountCircle
//                 sx={{ color: "action.active", fontSize: "40px" }}
//               />
//               <span style={{ marginTop: "5px" }}>{user.name}</span>{" "}
//             </a>
//           ))
//         ) : (
//           filteredUserNames.map((user, index) => (
//             <a
//               key={index}
//               href="#"
//               onClick={() => handleUserClick(user)}
//               onMouseEnter={() => setHoveredUser(user)}
//               onMouseLeave={() => setHoveredUser(null)}
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//                 textDecoration: "none",
//                 borderRadius: "20px",
//                 width: "160px",
//                 padding: "10px",
//                 marginRight: "50px",
//                 marginBottom: "10px",
//                 transform: `${
//                   clickedUser === user ? "scale(0.3)" : "scale(1)"
//                 } ${hoveredUser === user ? "scale(1.2)" : "scale(1)"}`,
//                 transition: "transform 0.5s ease",
//                 backgroundColor: hoveredUser === user ? "#87ceeb" : "",
//                 color: hoveredUser === user ? "white" : "",
//                 boxShadow:
//                   hoveredUser === user
//                     ? "10px 10px 20px rgba(128, 229, 216, 1)"
//                     : "",
//                 border:
//                   hoveredUser === user
//                     ? "1px solid white"
//                     : "1px solid var(--textPrimary)",
//               }}
//             >
//               <AccountCircle
//                 sx={{ color: "action.active", fontSize: "40px" }}
//               />
//               <span style={{ marginTop: "5px" }}>{user.name}</span>{" "}
//             </a>
//           ))
//         )}
//       </div>

//       {/* Popup to display user data */}
//       {selectedUser && (
//         <div
//           className="popup-window"
//           style={{
//             position: "fixed",

//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             //backgroundColor: "white",
//             padding: "20px",
//             borderRadius: "10px",
//             boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",

//             animation: "dropTop 0.5s linear",
//             backgroundColor: "#87ceeb",
//           }}
//         >
//           <button
//             onClick={() => {
//               const popupWindow = document.querySelector(
//                 ".popup-window"
//               ) as HTMLElement;
//               if (popupWindow) {
//                 popupWindow.style.animation = "dropBottom 0.5s linear";
//               }
//               setTimeout(() => setSelectedUser(null), 500);
//             }}
//             style={{
//               position: "fixed",
//               top: "10px",
//               right: "10px",
//               padding: "3px 8px",
//               borderRadius: "5px",
//               border: "none",
//               cursor: "pointer",
//             }}
//           >
//             Close
//           </button>
//           <h2 style={{ paddingTop: "20px" }}>User Details</h2>
//           <p>Name: {selectedUser.name}</p>
//           <p>
//             Start Year:{" "}
//             {
//               selectedUser.start_term &&
//                 getSemester(selectedUser.start_term.toDate()) // check semester
//             }
//           </p>
//           <p>Email: {selectedUser.purdue_email}</p>
//           <p>Prefer Majors:</p>
//           <ul>
//             {selectedUser.prefer_majors.map(
//               (major: { name: string }, index: number) => (
//                 <li key={index} style={{ textAlign: "left" }}>
//                   {major.name}
//                 </li>
//               )
//             )}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }
// export default AdvisorHomepageFilter;

//line

// import React, { useState, useEffect, useMemo } from "react";
// import { Wave, Random } from "react-animated-text";
// import Button from "@mui/material/Button";
// import ButtonGroup from "@mui/material/ButtonGroup";
// import Radio from "@mui/material/Radio";
// import RadioGroup from "@mui/material/RadioGroup";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import FormControl from "@mui/material/FormControl";
// import FormLabel from "@mui/material/FormLabel";
// import Box from "@mui/material/Box";
// import Dialog from '@mui/material/Dialog';
// import DialogTitle from "@mui/material/DialogTitle";
// import DialogContent from "@mui/material/DialogContent";
// import DialogActions from "@mui/material/DialogActions";
// import TextField from "@mui/material/TextField";
// import AccountCircle from "@mui/icons-material/AccountCircle";
// import firebase from "firebase/app"s;
// import { initializeApp } from "firebase/app";
// import "firebase/auth";
// import "firebase/firestore";
// import { doc, updateDoc } from "firebase/firestore";
// import { firestore } from "../models/firebase.ts";
// import "firebase/firestore";
// import {
//   getFirestore,
//   collection,
//   getDocs,
//   query,
//   where,
// } from "firebase/firestore";
// import "./AdvisorHomepageFilter.css";
// import app from "../models/firebase.ts";
// import { useAuth } from "../components/contexts/AuthContext";

// function AdvisorHomepageFilter() {
//   const [value, setValue] = useState("female");
//   const [userNames, setUserNames] = useState<
//     {
//       name: string;
//       start_term: any;
//       purdue_email: string;
//       prefer_majors: { name: string }[];
//     }[]
//   >([]);
//   const [selectedUser, setSelectedUser] = useState<any>(null);
//   const [clickedUser, setClickedUser] = useState(null);
//   const [hoveredUser, setHoveredUser] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [popupVisible, setPopupVisible] = useState(false);
//   const [clickedLabel, setClickedLabel] = useState(null);
//   const [list, setList] = useState(null);
//   const [emailInput, setEmailInput] = useState("");
//   const [showEmailDialog, setShowEmailDialog] = useState(false);

//   // Add a state variable to hold the sorting option
//   const [sortingOption, setSortingOption] = useState(null);

//   const { currentUser } = useAuth();

//   const textStyle = {
//     //result not found
//     //display: "inline-block",

//     marginBottom: "1em",
//     padding: "2em 1em 1em 1em",
//     width: "80%",
//     fontSize: "2rem",
//   };

//   const codeDivStyle = {
//     marginTop: "2em",
//     padding: "1px 1em",
//     overflow: "scroll",
//     fontSize: "2rem",
//   };

//   const Wave1 = () => (
//     <div style={textStyle}>
//       <Wave
//         text="NO RESULTS FOUND"
//         effect="fadeOut"
//         effectChange={0.1}
//         effectDuration={0.01}
//       />

//       <div style={codeDivStyle}></div>
//     </div>
//   );

//   useEffect(() => {
//     const firestore = getFirestore(app);
//     const fetchUserNames = async () => {
//       const usersSnapshot = await getDocs(collection(firestore, "users"));
//       const usersData: {
//         name: string;
//         purdue_email: string;
//         prefer_majors: { name: string }[];
//         user_type: string;
//         start_term: any;
//       }[] = [];
//       usersSnapshot.forEach((doc) => {
//         const userData = doc.data();
//         if (userData.user_type === "student") {
//           usersData.push({
//             name: userData.name,
//             purdue_email: userData.purdue_email,
//             prefer_majors: userData.prefer_majors || [],
//             user_type: userData.user_type,
//             start_term: userData.start_term,
//           });
//         }
//       });
//       setUserNames(usersData);
//     };

//     fetchUserNames();
//   }, []);

//   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setValue(event.target.value);
//     setSortingOption(event.target.value); // Set the sorting option
//   };

//   const handleUserClick = (userData: any) => {
//     setSelectedUser(userData);
//     setClickedUser(userData);
//     setPopupVisible(true);
//     setClickedLabel(userData);
//     setTimeout(() => {
//       setClickedUser(null);
//     }, 50); // time
//   };

//   const handleCloseButtonClick = () => {
//     setPopupVisible(false);
//     setTimeout(() => {
//       setSelectedUser(null);
//     }, 500); // timeout to match animation
//   };

//   const handleEmailInputChange = (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     setEmailInput(event.target.value);
//   };

//   const handleEmailDialogSubmit = () => {
//     setShowEmailDialog(false); // Close the dialog
//     // Split entered emails by comma and trim spaces
//     const emails = emailInput.split(",").map((email) => email.trim());
//     // Fetch users from Firebase based on entered emails
//     const firestore = getFirestore(app);
//     const fetchUsersByEmails = async () => {
//       const usersSnapshot = await getDocs(
//         query(
//           collection(firestore, "users"),
//           where("purdue_email", "in", emails)
//         )
//       );
//       const usersData: {
//         name: string;
//         purdue_email: string;
//         prefer_majors: { name: string }[];
//         user_type: string;
//         start_term: any;
//       }[] = [];
//       usersSnapshot.forEach((doc) => {
//         const userData = doc.data();
//         if (userData.user_type === "student") {
//           usersData.push({
//             name: userData.name,
//             purdue_email: userData.purdue_email,
//             prefer_majors: userData.prefer_majors || [],
//             user_type: userData.user_type,
//             start_term: userData.start_term,
//           });
//         }
//       });
//       setUserNames(usersData);
//     };
//     fetchUsersByEmails();
//   };

//   const filteredUserNames = userNames.filter((user) => {
//     const query = searchQuery?.toLowerCase() || "";
//     console.log("user:", user);
//     console.log("query:", query);
//     console.log("user.name:", user.name);
//     console.log("user.purdue_email:", user.purdue_email);
//     console.log("user.prefer_majors:", user.prefer_majors);

//     return (
//       user.name.toLowerCase().includes(query) ||
//       (user.start_term &&
//         getSemester(user.start_term.toDate()) // Check semester
//           .toLowerCase()
//           .includes(query)) ||
//       user.purdue_email.toLowerCase().includes(query) ||
//       user.prefer_majors.some((major) =>
//         major.name.toLowerCase().includes(query)
//       )
//     );
//   });

//   // sort based on options
//   const sortedUserNames = useMemo(() => {
//     let sortedUsers = [...filteredUserNames];
//     switch (sortingOption) {
//       case "alphabetincrease":
//         sortedUsers.sort((a, b) => a.name.localeCompare(b.name)); // sort alphabetically in ascending order
//         break;
//       case "alphabetdecrease":
//         sortedUsers.sort((a, b) => b.name.localeCompare(a.name)); // sort alphabetically in descending order
//         break;
//       case "yearincrease":
//         sortedUsers.sort((a, b) => {
//           const yearA = a.start_term && a.start_term.toDate().getFullYear();
//           const yearB = b.start_term && b.start_term.toDate().getFullYear();
//           if (yearA !== yearB) {
//             return yearA - yearB; // year in ascending order
//           } else {
//             // compare semester spring before fall
//             const semesterA = getSemester(a.start_term.toDate());
//             const semesterB = getSemester(b.start_term.toDate());
//             if (semesterA === semesterB) return 0;
//             return semesterA < semesterB ? 1 : -1;
//           }
//         });
//         break;
//       case "yeardecrease":
//         sortedUsers.sort((a, b) => {
//           const yearA = a.start_term && a.start_term.toDate().getFullYear();
//           const yearB = b.start_term && b.start_term.toDate().getFullYear();
//           if (yearA !== yearB) {
//             return yearB - yearA; // year descending
//           } else {
//             //compare semester
//             const semesterA = getSemester(a.start_term.toDate());
//             const semesterB = getSemester(b.start_term.toDate());
//             if (semesterA === semesterB) return 0;
//             return semesterA < semesterB ? -1 : 1;
//           }
//         });
//         break;
//       // Add other sorting options here if needed
//       default:
//         break;
//     }
//     return sortedUsers;
//   }, [filteredUserNames, sortingOption]);

//   function getSemester(date: Date) {
//     const month = date.getMonth() + 1;
//     const year = date.getFullYear();
//     if (month >= 1 && month <= 6) {
//       return "Spring " + year;
//     } else if (month >= 7 && month <= 12) {
//       return "Fall " + year;
//     }
//     return "";
//   }

//   return (
//     <div className="AddsivorHomePageFilter">
//       <div className="studentSearching">
//         <div>
//           <AccountCircle sx={{ color: "action.active", mr: 1, my: 0.5 }} />
//           <TextField
//             id="input-with-sx"
//             label="Search student"
//             variant="standard"
//             style={{ width: "201px" }}
//             onChange={(e) => setSearchQuery(e.target.value)} // update search state
//           />
//         </div>
//         <br />
//         <FormControl
//           sx={{
//             border: "2px solid var(--textPrimary)",
//             borderRadius: "5px",
//             padding: "10px",
//           }}
//         >
//           <RadioGroup
//             aria-labelledby="demo-controlled-radio-buttons-group"
//             name="controlled-radio-buttons-group"
//             value={sortingOption}
//             onChange={handleChange}
//             //onChange={(e) => setSortingOption(e.target.value)}
//           >
//             <FormControlLabel
//               className="radio-group-shadow"
//               value="default"
//               control={
//                 <Radio
//                   sx={{
//                     "& .MuiSvgIcon-root": {
//                       fontSize: 35,
//                     },
//                   }}
//                 />
//               }
//               label="Reset"
//             />
//             <FormControlLabel
//               className="radio-group-shadow"
//               value="alphabetincrease"
//               control={
//                 <Radio
//                   sx={{
//                     "& .MuiSvgIcon-root": {
//                       fontSize: 35,
//                     },
//                   }}
//                 />
//               }
//               label="Sort alphabetically (ascending)"
//             />
//             <FormControlLabel
//               className="radio-group-shadow"
//               value="alphabetdecrease"
//               control={
//                 <Radio
//                   sx={{
//                     "& .MuiSvgIcon-root": {
//                       fontSize: 35,
//                     },
//                   }}
//                 />
//               }
//               label="Sort alphabetically (descending)"
//             />
//             <FormControlLabel
//               className="radio-group-shadow"
//               value="yearincrease"
//               control={
//                 <Radio
//                   sx={{
//                     "& .MuiSvgIcon-root": {
//                       fontSize: 35,
//                     },
//                   }}
//                 />
//               }
//               label="Sort by year (ascending)"
//             />
//             <FormControlLabel
//               className="radio-group-shadow"
//               value="yeardecrease"
//               control={
//                 <Radio
//                   sx={{
//                     "& .MuiSvgIcon-root": {
//                       fontSize: 35,
//                     },
//                   }}
//                 />
//               }
//               label="Sort by year (descending)"
//             />
//           </RadioGroup>
//         </FormControl>
//       </div>

//       <div className="searchResult">
//         {(sortingOption && sortedUserNames.length === 0) ||
//         filteredUserNames.length === 0 ? (
//           <Wave1 />
//         ) : sortingOption ? (
//           sortedUserNames.map((user, index) => (
//             <a
//               key={index}
//               href="#"
//               onClick={() => handleUserClick(user)}
//               onMouseEnter={() => setHoveredUser(user)}
//               onMouseLeave={() => setHoveredUser(null)}
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//                 textDecoration: "none",
//                 borderRadius: "20px",
//                 width: "160px",
//                 padding: "10px",
//                 marginRight: "50px",
//                 marginBottom: "10px",
//                 transform: `${
//                   clickedUser === user ? "scale(0.3)" : "scale(1)"
//                 } ${hoveredUser === user ? "scale(1.2)" : "scale(1)"}`,
//                 transition: "transform 0.5s ease",
//                 backgroundColor: hoveredUser === user ? "#87ceeb" : "",
//                 color: hoveredUser === user ? "white" : "",
//                 boxShadow:
//                   hoveredUser === user
//                     ? "10px 10px 20px rgba(128, 229, 216, 1)"
//                     : "",
//                 border:
//                   hoveredUser === user
//                     ? "1px solid white"
//                     : "1px solid var(--textPrimary)",
//               }}
//             >
//               <AccountCircle
//                 sx={{ color: "action.active", fontSize: "40px" }}
//               />
//               <span style={{ marginTop: "5px" }}>{user.name}</span>{" "}
//             </a>
//           ))
//         ) : (
//           filteredUserNames.map((user, index) => (
//             <a
//               key={index}
//               href="#"
//               onClick={() => handleUserClick(user)}
//               onMouseEnter={() => setHoveredUser(user)}
//               onMouseLeave={() => setHoveredUser(null)}
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//                 textDecoration: "none",
//                 borderRadius: "20px",
//                 width: "160px",
//                 padding: "10px",
//                 marginRight: "50px",
//                 marginBottom: "10px",
//                 transform: `${
//                   clickedUser === user ? "scale(0.3)" : "scale(1)"
//                 } ${hoveredUser === user ? "scale(1.2)" : "scale(1)"}`,
//                 transition: "transform 0.5s ease",
//                 backgroundColor: hoveredUser === user ? "#87ceeb" : "",
//                 color: hoveredUser === user ? "white" : "",
//                 boxShadow:
//                   hoveredUser === user
//                     ? "10px 10px 20px rgba(128, 229, 216, 1)"
//                     : "",
//                 border:
//                   hoveredUser === user
//                     ? "1px solid white"
//                     : "1px solid var(--textPrimary)",
//               }}
//             >
//               <AccountCircle
//                 sx={{ color: "action.active", fontSize: "40px" }}
//               />
//               <span style={{ marginTop: "5px" }}>{user.name}</span>{" "}
//             </a>
//           ))
//         )}
//       </div>

//       {/* Popup to display user data */}
//       {selectedUser && (
//         <div
//           className="popup-window"
//           style={{
//             position: "fixed",

//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             //backgroundColor: "white",
//             padding: "20px",
//             borderRadius: "10px",
//             boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",

//             animation: "dropTop 0.5s linear",
//             backgroundColor: "#87ceeb",
//           }}
//         >
//           <button
//             onClick={() => {
//               const popupWindow = document.querySelector(
//                 ".popup-window"
//               ) as HTMLElement;
//               if (popupWindow) {
//                 popupWindow.style.animation = "dropBottom 0.5s linear";
//               }
//               setTimeout(() => setSelectedUser(null), 500);
//             }}
//             style={{
//               position: "fixed",
//               top: "10px",
//               right: "10px",
//               padding: "3px 8px",
//               borderRadius: "5px",
//               border: "none",
//               cursor: "pointer",
//             }}
//           >
//             Close
//           </button>
//           <h2 style={{ paddingTop: "20px" }}>User Details</h2>
//           <p>Name: {selectedUser.name}</p>
//           <p>
//             Start Year:{" "}
//             {
//               selectedUser.start_term &&
//                 getSemester(selectedUser.start_term.toDate()) // check semester
//             }
//           </p>
//           <p>Email: {selectedUser.purdue_email}</p>
//           <p>Prefer Majors:</p>
//           <ul>
//             {selectedUser.prefer_majors.map(
//               (major: { name: string }, index: number) => (
//                 <li key={index} style={{ textAlign: "left" }}>
//                   {major.name}
//                 </li>
//               )
//             )}
//           </ul>
//         </div>
//       )}
//       <Button onClick={() => setShowEmailDialog(true)}>Add Students</Button>
//     </div>
//   );
// }
// export default AdvisorHomepageFilter;

import React, { useState, useEffect, useMemo } from "react";
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
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "../models/firebase.ts";
import "firebase/firestore";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import "./AdvisorHomepageFilter.css";
import app from "../models/firebase.ts";
import { useAuth } from "../components/contexts/AuthContext";

function AdvisorHomepageFilter() {
  const [value, setValue] = useState("female");
  const [userNames, setUserNames] = useState<
    {
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
  const [emailInput, setEmailInput] = useState("");
  const [showEmailDialog, setShowEmailDialog] = useState(false);

  // Add a state variable to hold the sorting option
  const [sortingOption, setSortingOption] = useState(null);

  const { currentUser } = useAuth();

  const textStyle = {
    //result not found
    //display: "inline-block",

    marginBottom: "1em",
    padding: "2em 1em 1em 1em",
    width: "80%",
    fontSize: "2rem",
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

  useEffect(() => {
    const firestore = getFirestore(app);
    const fetchUserNames = async () => {
      const usersSnapshot = await getDocs(collection(firestore, "users"));
      const usersData: {
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

  const handleEmailInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEmailInput(event.target.value);
  };

  const handleEmailDialogSubmit = () => {
    setShowEmailDialog(false); // Close the dialog
    // Split entered emails by comma and trim spaces
    const emails = emailInput.split(",").map((email) => email.trim());
    // Fetch users from Firebase based on entered emails
    const firestore = getFirestore(app);
    const fetchUsersByEmails = async () => {
      const usersSnapshot = await getDocs(
        query(
          collection(firestore, "users"),
          where("purdue_email", "in", emails)
        )
      );
      const usersData: {
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
    fetchUsersByEmails();
  };

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

  return (
    <div className="AddsivorHomePageFilter">
      {showEmailDialog && (
        <div className="email-dialog">
          <h2>Enter emails of students to add</h2>
          <TextField
            id="email-input"
            label="Emails"
            variant="outlined"
            value={emailInput}
            onChange={handleEmailInputChange}
          />
          <Button onClick={handleEmailDialogSubmit}>Submit</Button>
        </div>
      )}

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
      </div>

      <div className="searchResult">
        {(sortingOption && userNames.length === 0) || userNames.length === 0 ? (
          <Wave1 />
        ) : sortingOption ? (
          userNames.map((user, index) => (
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
                } ${hoveredUser === user ? "scale(1.2)" : "scale(1)"}`,
                transition: "transform 0.5s ease",
                backgroundColor: hoveredUser === user ? "#87ceeb" : "",
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
        ) : (
          userNames.map((user, index) => (
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
                } ${hoveredUser === user ? "scale(1.2)" : "scale(1)"}`,
                transition: "transform 0.5s ease",
                backgroundColor: hoveredUser === user ? "#87ceeb" : "",
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
        )}
      </div>

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
        </div>
      )}

      <Button onClick={() => setShowEmailDialog(true)}>Add Students</Button>
    </div>
  );
}
export default AdvisorHomepageFilter;
