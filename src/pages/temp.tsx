// import React, { useState, useEffect } from "react";
// import NavBar from "../components/NavBar/NavBar.tsx";
// import ScheduleView from "../components/ScheduleView/ScheduleView.tsx";
// import "./DegreePlanner.css";
// // firebase imports
// import { useAuth } from "../components/contexts/AuthContext.tsx";
// import {
//   doc,
//   getDoc,
//   updateDoc,
//   arrayRemove,
//   Timestamp,
//   arrayUnion,
//   DocumentReference,
//   DocumentData,
// } from "firebase/firestore";
// import { firestore } from "../models/firebase.ts";
// import { DragDropContext } from "react-beautiful-dnd";
// import RemoteUserdata from "../models/RemoteUserData.ts";
// import {
//   isTermInPast,
//   getSatisfied,
//   Schedule,
// } from "../models/BoilerCompass.ts";
// import { CS } from "../models/CS.ts";
// // sidebar import
// import "../components/ScheduleSide/ScheduleSide.css";
// import Searchbar from "components/Searchbar.js";
// // search bar input
// import "../components/Searchbar.css";
// import { ThemeProvider, createTheme } from "@mui/material";
// import UserData from "models/UserData.ts";
// import ReqModal from "components/ReqModal";

// const SEMESTER_DATA = [
//   {
//     id: 0,
//     year: 2022,
//     term: "Fall",
//     course_list: [
//       // {
//       //     id: "1",
//       //     course: "CS25200",
//       //     description: "something",
//       //     credit: 3,
//       // },
//     ],
//     credit: 0,
//   },
//   {
//     id: 1,
//     year: 2023,
//     term: "Spring",
//     course_list: [],
//     credit: 0,
//   },
//   {
//     id: 2,
//     year: 2023,
//     term: "Summer",
//     course_list: [],
//     credit: 0,
//   },
//   {
//     id: 3,
//     year: 2023,
//     term: "Fall",
//     course_list: [],
//     credit: 0,
//   },
//   {
//     id: 4,
//     year: 2024,
//     term: "Spring",
//     course_list: [],
//     credit: 0,
//   },
//   {
//     id: 5,
//     year: 2024,
//     term: "Summer",
//     course_list: [],
//     credit: 0,
//   },
//   {
//     id: 6,
//     year: 2024,
//     term: "Fall",
//     course_list: [],
//     credit: 0,
//   },
//   {
//     id: 7,
//     year: 2025,
//     term: "Spring",
//     course_list: [],
//     credit: 0,
//   },
//   {
//     id: 8,
//     year: 2025,
//     term: "Summer",
//     course_list: [],
//     credit: 0,
//   },
//   {
//     id: 9,
//     year: 2025,
//     term: "Fall",
//     course_list: [],
//     credit: 0,
//   },
//   {
//     id: 10,
//     year: 2026,
//     term: "Spring",
//     course_list: [],
//     credit: 0,
//   },
//   {
//     id: 11,
//     year: 2026,
//     term: "Summer",
//     course_list: [],
//     credit: 0,
//   },
// ];
// type Props = {
//   darkmode: boolean;
//   setDarkmode: React.Dispatch<React.SetStateAction<boolean>>;
// };

// export default function DegreePlanner({ darkmode, setDarkmode }: Props) {
//   //get current user and mode preference
//   const { currentUser } = useAuth();
//   const userData: UserData = new RemoteUserdata();
//   const [scheduleList, setscheduleList] = useState({
//     currIndex: 0,
//     currId: "1",
//     currName: "",
//     list: [],
//   });
//   const [semesterBlocks, setSemesterBlocks] = useState(SEMESTER_DATA);
//   const [searchResult, setSearchResult] = useState([]);
//   // progress bar data
//   const [completed, setCompleted] = useState(0);
//   const [total, setTotal] = useState(100);
//   const [planned, setPlanned] = useState(0);
//   const [reqModalOpen, setReqModalOpen] = useState(false);
//   //schedule mode
//   const [viewOnly, setViewOnly] = useState(false);
//   const [userOwnSchedule, setUserOwnSchedule] = useState(true); // true == user's own schedule, false == friend's schedule
//   const [friendSchedule, setFriendSchedule] = useState(null);

//   const [completedCourses, setCompletedCourses] = useState([]);
//   const [courseGrades, setCourseGrades] = useState({});

//   // get firebase data (dark mode & schedule) if the user is a firebase user
//   useEffect(() => {
//     if (currentUser) {
//       getDoc(doc(firestore, "users", currentUser.uid)).then((docSnapshot) => {
//         setDarkmode(docSnapshot.data().dark_mode);
//         setscheduleList({ ...scheduleList, list: docSnapshot.data().schedule });
//         setCompletedCourses(docSnapshot.data().completed_courses);
//       });
//     }
//   }, [currentUser]);

//   // get the user's all schedule from firebase when possible
//   // for nav bar schedule selection
//   useEffect(() => {
//     if (scheduleList.list.length > 0) {
//       getDoc(
//         doc(firestore, "schedules", scheduleList.list[scheduleList.currIndex])
//       )
//         .then((scheduleSnap) => {
//           setscheduleList({
//             ...scheduleList,
//             currId: scheduleList.list[scheduleList.currIndex],
//             currName: scheduleSnap.data().name,
//           });
//           setSemesterBlocks(scheduleSnap.data().semester_blocks);
//         })
//         .catch((error) => {
//           console.log(error);
//           // setSemesterBlocks(SEMESTER_DATA);
//         });
//     }
//   }, [scheduleList.list]);

//   return (
//     <div className="DegreeOverview">
//       <div className="DegreeContent">
//         <DragDropContext onDragEnd={handleDragDrop}>
//           {userOwnSchedule && (
//             <ScheduleView
//               name={scheduleList.currName}
//               id={scheduleList.currId}
//               semesterBlocks={semesterBlocks}
//               setParentSemesterBlocks={adjustSemesterBlocks}
//               viewOnly={viewOnly}
//               completed={completed}
//               planned={planned}
//               total={total}
//               completedCourses={completedCourses}
//               courseGrades={courseGrades}
//               scheduleList={scheduleList}
//               setscheduleList={setscheduleList}
//             />
//           )}
//           {!userOwnSchedule && friendSchedule && (
//             <ScheduleView
//               name={friendSchedule.name}
//               id={friendSchedule.ID}
//               semesterBlocks={friendSchedule.semester_blocks}
//               setParentSemesterBlocks={adjustSemesterBlocks}
//               viewOnly={viewOnly}
//               completed={friendSchedule.completed}
//               planned={friendSchedule.planned}
//               total={friendSchedule.total}
//               scheduleList={scheduleList}
//               setscheduleList={setscheduleList}
//             />
//           )}
//         </DragDropContext>
//       </div>
//     </div>
//   );
// }
