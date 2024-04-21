import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar/NavBar";
import ScheduleView from "../components/ScheduleView/ScheduleView";
import "./DegreePlanner.css";
// firebase imports
import { useAuth } from "../components/contexts/AuthContext.tsx";
import {
  doc,
  getDoc,
  updateDoc,
  arrayRemove,
  Timestamp,
  arrayUnion,
  deleteDoc,
  addDoc,
  collection,
} from "firebase/firestore";
import { firestore } from "../models/firebase.ts";
import { DragDropContext } from "react-beautiful-dnd";
import RemoteUserdata from "../models/RemoteUserData";
import {
  isTermInPast,
  getSatisfied,
  Schedule,
  Semester,
} from "../models/BoilerCompass";
import { CS } from "../models/CS";
// sidebar import
import Searchbar from "components/Searchbar.js";
// search bar input
import "../components/Searchbar.css";
import { ThemeProvider, createTheme } from "@mui/material";
import UserData from "models/UserData.ts";
import ReqModal from "components/ReqModal";

//test, added in sidebar area
import FriendsList from "components/FriendsList/FriendsList.tsx";
import CopyScheduleButton from "components/CopyScheduleButton.tsx";
import Friends from "./FriendsSidebar/Friends.tsx";
import ChangeScheduleName from "components/ChangeScheduleName.tsx";
import { KeyboardReturnOutlined } from "@mui/icons-material";

// temperary data for semester_blocks in Schedule
const SCHEDULE_DATA = {
  id: "12345",
  name: "Friend Schedule",
  start_term: new Date("2022-08-19T24:00:00.000Z"),
  end_term: new Date("2026-05-03T24:00:00.000Z"),
  semester_blocks: [
    {
      id: 0,
      year: 2022,
      term: "Fall",
      credit: 4,
      course_list: [
        {
          id: "24508954-e0bc-407f-a823-ff348a51ac99",
          classId: "1842e869-5d34-410a-b3e5-3ca3de853edf",
          course: "CS18000",
          description: "something",
          credit: 4,
          meeting: null,
        },
      ],
    },
    {
      id: 1,
      year: 2023,
      term: "Spring",
      course_list: [],
    },
    {
      id: 2,
      year: 2023,
      term: "Summer",
      course_list: [],
    },
    {
      id: 3,
      year: 2023,
      term: "Fall",
      course_list: [],
    },
    {
      id: 4,
      year: 2024,
      term: "Spring",
      course_list: [],
    },
    {
      id: 5,
      year: 2024,
      term: "Summer",
      course_list: [],
    },
    {
      id: 6,
      year: 2024,
      term: "Fall",
      course_list: [],
    },
    {
      id: 7,
      year: 2025,
      term: "Spring",
      course_list: [],
    },
    {
      id: 8,
      year: 2025,
      term: "Summer",
      course_list: [],
    },
    {
      id: 9,
      year: 2025,
      term: "Fall",
      course_list: [],
    },
    {
      id: 10,
      year: 2026,
      term: "Spring",
      course_list: [],
    },
    {
      id: 11,
      year: 2026,
      term: "Summer",
      course_list: [],
    },
  ],
  majors: [
    {
      name: "Computer Science",
    },
  ],
  minors: [],
  completed_courses: ["24508954-e0bc-407f-a823-ff348a51ac99"],
  planned_courses: [],
};
const SEMESTER_DATA = [
  {
    id: 0,
    year: 2022,
    term: "Fall",
    course_list: [
      // {
      //     id: "1",
      //     course: "CS25200",
      //     description: "something",
      //     credit: 3,
      // },
    ],
    credit: 0,
  },
  {
    id: 1,
    year: 2023,
    term: "Spring",
    course_list: [],
    credit: 0,
  },
  {
    id: 2,
    year: 2023,
    term: "Summer",
    course_list: [],
    credit: 0,
  },
  {
    id: 3,
    year: 2023,
    term: "Fall",
    course_list: [],
    credit: 0,
  },
  {
    id: 4,
    year: 2024,
    term: "Spring",
    course_list: [],
    credit: 0,
  },
  {
    id: 5,
    year: 2024,
    term: "Summer",
    course_list: [],
    credit: 0,
  },
  {
    id: 6,
    year: 2024,
    term: "Fall",
    course_list: [],
    credit: 0,
  },
  {
    id: 7,
    year: 2025,
    term: "Spring",
    course_list: [],
    credit: 0,
  },
  {
    id: 8,
    year: 2025,
    term: "Summer",
    course_list: [],
    credit: 0,
  },
  {
    id: 9,
    year: 2025,
    term: "Fall",
    course_list: [],
    credit: 0,
  },
  {
    id: 10,
    year: 2026,
    term: "Spring",
    course_list: [],
    credit: 0,
  },
  {
    id: 11,
    year: 2026,
    term: "Summer",
    course_list: [],
    credit: 0,
  },
];
type Props = {
  darkmode: boolean;
  setDarkmode: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function DegreePlanner({ darkmode, setDarkmode }: Props) {
  //get current user and mode preference
  const { currentUser } = useAuth();
  const userData: UserData = new RemoteUserdata();
  // const [scheduleList, setscheduleList] = useState({
  //     currId: "1",
  //     currName: "",
  //     list: []
  // });
  const [currSchedule, setCurrSchedule] = useState({
    id: "1",
    name: "",
  });
  const [semesterBlocks, setSemesterBlocks] = useState(SEMESTER_DATA);
  const [schedulesList, setSchedulesList] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  // progress bar data
  const [completed, setCompleted] = useState(0);
  const [total, setTotal] = useState(100);
  const [planned, setPlanned] = useState(0);
  const [reqModalOpen, setReqModalOpen] = useState(false);
  //schedule mode
  const [userOwnSchedule, setUserOwnSchedule] = useState(true); // true == user's own schedule, false == friend's schedule
  const [completedCourses, setCompletedCourses] = useState([]);
  // const [courseGrades, setCourseGrades] = useState({})

  const [filterCourses, setFilterCourses] = useState([]);
  const [filterName, setFilterName] = useState("");

  useEffect(() => {
    if (currentUser) {
      getDoc(doc(firestore, "users", currentUser.uid))
        .then((docSnapshot) => {
          setDarkmode(docSnapshot.data().dark_mode);
          setCompletedCourses(docSnapshot.data().completed_courses);
        })
        .catch((error) => {
          console.error("Fetch Data Error:", error);
        });
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      getDoc(doc(firestore, "users", currentUser.uid))
        .then((docSnapshot) => {
          let scheduleArr = docSnapshot.data().schedule;
          if (scheduleArr.length > 0) {
            const schedulePromises = scheduleArr.map((s) =>
              getDoc(doc(firestore, "schedules", s))
            );
            Promise.all(schedulePromises).then((scheduleSnapshot) => {
              const newScheduleList = scheduleSnapshot.map(
                (scheduleSnap, index) => ({
                  id: scheduleArr[index],
                  name: scheduleSnap.data().name,
                })
              );
              setSchedulesList(newScheduleList);
            });
          }
        })
        .catch((error) => {
          console.error("Fetch Data Error:", error);
        });
    }
  }, [currentUser]);

  // get the curr schedule data
  useEffect(() => {
    if (schedulesList.length <= 0) return;
    // console.log(schedulesList);
    setCurrSchedule({ id: schedulesList[0].id, name: schedulesList[0].name });
  }, [schedulesList.length]);

  useEffect(() => {
    console.log("setting new curr schedule: ", currSchedule.id);
    if (currSchedule.id == "1") return;
    getDoc(doc(firestore, "schedules", currSchedule.id)).then(
      (scheduleSnapShot) => {
        setSemesterBlocks(scheduleSnapShot.data().semester_blocks);
      }
    );
    calculateProgress();
  }, [currSchedule.id]);

  useEffect(() => {
    console.log(currSchedule.name);
  }, [currSchedule.name]);

  function calculateProgress() {
    if (currSchedule.id == "1") return;
    // get numbers for calculating degree progress
    if (currentUser) {
      // get completed and total
      // userData.get("completed_courses")
      //     .then((completed) => {
      //         let c = getSatisfied(CS, new Set(completed));
      //         setCompleted(c[0]);
      //         setTotal(c[1]);
      //     })

      // get planned
      // userData.get("planned_courses")
      // .then((planned) => {
      //     let c = getSatisfied(CS, new Set(planned));
      //     setPlanned(c[0]);
      // })
      getDoc(doc(firestore, "schedules", currSchedule.id)).then(
        (docSnapshot) => {
          let planned = getSatisfied(
            CS,
            new Set(docSnapshot.data().planned_courses)
          );
          setPlanned(planned[0]);
          let completed = getSatisfied(
            CS,
            new Set(docSnapshot.data().completed_courses)
          );
          setCompleted(completed[0]);
          setTotal(completed[1]);
        }
      );
    }
  }

  var mode_str;
  if (darkmode) {
    mode_str = "dark";
  } else {
    mode_str = "light";
  }
  const mode = createTheme({
    palette: {
      mode: mode_str,
    },
  });

  // return 1, need to update completed courses
  // return 0, only update planned courses
  function ifYearPassed(year: number, term: string) {
    let currDate = new Date();
    if (currDate.getFullYear() > year) {
      return 1;
    } else if (currDate.getFullYear() < year) {
      return 0;
    } else {
      if (term === "Fall") {
        if (currDate.getMonth() == 12) {
          return 1;
        } else {
          return 0;
        }
      } else if (term === "Spring") {
        if (currDate.getMonth() >= 5) {
          return 1;
        } else {
          return 0;
        }
      } else {
        if (currDate.getMonth() >= 9) {
          return 1;
        } else {
          return 0;
        }
      }
    }
  }

  const addCompletedCourse = (id) => {
    const s = new Set(completedCourses);
    if (!s.has(id)) {
      const c = completedCourses;
      c.push(id);
      setCompletedCourses(c);
      userData.put("completed_courses", c);
    } else {
      userData.put("completed_courses", completedCourses);
    }
  };

  const removeCompletedCourse = (id) => {
    const s = new Set(completedCourses);
    if (s.has(id)) {
      s.delete(id);
      setCompletedCourses([...s]);
      userData.put("completed_courses", [...s]);
    } else {
      userData.put("completed_courses", completedCourses);
    }
  };

  const handleDragDrop = (result) => {
    if (!userOwnSchedule) return;
    const { source, destination } = result;
    // console.log("drag occured");
    // console.log(result);

    // delete the course from semester
    if (!destination && source.droppableId !== "ROOT") {
      console.log("Semester to Null");
      const newSourceCourses = semesterBlocks[source.droppableId].course_list;

      const [deletedCourse] = newSourceCourses.splice(source.index, 1);

      let cr = semesterBlocks[source.droppableId].credit;
      cr = cr - deletedCourse.credit;
      if (cr < 12) {
        alert("Less than 12 credits");
      }
      if (cr > 18) {
        alert("More than 18 credits");
      }

      const newSemesterBlocks = [...semesterBlocks];
      newSemesterBlocks[source.droppableId] = {
        ...semesterBlocks[source.droppableId],
        course_list: newSourceCourses,
        credit: cr,
      };
      // update the change in firebase then update the UI if firebase update successfully
      if (currSchedule.id != "1") {
        const semesterRef = doc(firestore, "schedules", currSchedule.id);
        updateDoc(semesterRef, {
          semester_blocks: newSemesterBlocks,
        })
          .then(() => {
            setSemesterBlocks(newSemesterBlocks);
            // delete the course from the planed / completed courses in firebase
            updateDoc(semesterRef, {
              planned_courses: arrayRemove(deletedCourse.id),
              completed_courses: arrayRemove(deletedCourse.id),
            });
            calculateProgress();
            return;
          })
          .catch((e) => {
            console.log("drag firebase update error");
            console.log(e);
            return;
          });
      }
    }

    // drags that do not affect the schedules and search bar
    if (!destination) return;
    if (destination.droppableId === "ROOT") return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    // from the search result to semester
    if (source.droppableId === "ROOT" && searchResult.length > 0) {
      console.log("Root to Semester");
      const newSourceCourses = searchResult;
      const newDestinationCourses =
        semesterBlocks[destination.droppableId].course_list;

      const [deletedCourse] = newSourceCourses.splice(source.index, 1);
      newDestinationCourses.splice(destination.index, 0, deletedCourse);

      let cr = semesterBlocks[destination.droppableId].credit;
      cr = cr + deletedCourse.credit;
      if (cr > 18) {
        alert("More than 18 credits");
      }

      const newSemesterBlocks = [...semesterBlocks];
      newSemesterBlocks[destination.droppableId] = {
        ...semesterBlocks[destination.droppableId],
        course_list: newDestinationCourses,
        credit: cr,
      };
      // console.log(deletedCourse);
      // console.log(newSourceCourses);
      // console.log(newSemesterBlocks);
      if (currSchedule.id != "1") {
        const semesterRef = doc(firestore, "schedules", currSchedule.id);
        updateDoc(semesterRef, {
          semester_blocks: newSemesterBlocks,
        })
          .then(() => {
            setSearchResult(newSourceCourses);
            setSemesterBlocks(newSemesterBlocks);
            if (
              ifYearPassed(
                semesterBlocks[destination.droppableId].year,
                semesterBlocks[destination.droppableId].term
              )
            ) {
              // console.log("update completed");
              updateDoc(semesterRef, {
                completed_courses: arrayUnion(deletedCourse.id),
              });
              addCompletedCourse(deletedCourse.id);
            } else {
              // console.log("update planned");
              updateDoc(semesterRef, {
                planned_courses: arrayUnion(deletedCourse.id),
              });
            }
            calculateProgress();
            return;
          })
          .catch((e) => {
            console.log("drag firebase update error");
            console.log(e);
          });
      }
    }
    // from semester to another semester
    else if (source.droppableId != destination.droppableId) {
      console.log("Semester to Semester");
      const newSourceCourses = semesterBlocks[source.droppableId].course_list;
      const newDestinationCourses =
        semesterBlocks[destination.droppableId].course_list;

      const [deletedCourse] = newSourceCourses.splice(source.index, 1);
      newDestinationCourses.splice(destination.index, 0, deletedCourse);

      let cr_source = semesterBlocks[source.droppableId].credit;
      let cr_dest = semesterBlocks[destination.droppableId].credit;
      cr_source = cr_source - deletedCourse.credit;
      cr_dest = cr_dest + deletedCourse.credit;
      if (cr_source < 12) {
        alert("Less than 12 credits");
      }
      if (cr_source > 18) {
        alert("More than 18 credits");
      }
      if (cr_dest < 12) {
        alert("Less than 12 credits");
      }
      if (cr_dest > 18) {
        alert("More than 18 credits");
      }

      const newSemesterBlocks = [...semesterBlocks];
      newSemesterBlocks[source.droppableId] = {
        ...semesterBlocks[source.droppableId],
        course_list: newSourceCourses,
        credit: cr_source,
      };
      newSemesterBlocks[destination.droppableId] = {
        ...semesterBlocks[destination.droppableId],
        course_list: newDestinationCourses,
        credit: cr_dest,
      };
      // console.log(deletedCourse);
      // console.log(newSourceCourses);
      // console.log(newDestinationCourses);
      if (currSchedule.id != "1") {
        const semesterRef = doc(firestore, "schedules", currSchedule.id);
        updateDoc(semesterRef, {
          semester_blocks: newSemesterBlocks,
        })
          .then(() => {
            setSemesterBlocks(newSemesterBlocks);
            if (
              ifYearPassed(
                semesterBlocks[destination.droppableId].year,
                semesterBlocks[destination.droppableId].term
              )
            ) {
              // console.log("add completed, delete planned");
              updateDoc(semesterRef, {
                completed_courses: arrayUnion(deletedCourse.id),
                planned_courses: arrayRemove(deletedCourse.id),
              });
              addCompletedCourse(deletedCourse.id);
            } else {
              // console.log("delete completed, add planned");
              updateDoc(semesterRef, {
                completed_courses: arrayRemove(deletedCourse.id),
                planned_courses: arrayUnion(deletedCourse.id),
              });
              removeCompletedCourse(deletedCourse.id);
            }
            calculateProgress();
            return;
          })
          .catch((e) => {
            console.log("drag firebase update error");
            console.log(e);
          });
      }
    }
    // change within semester
    else if (source.droppableId == destination.droppableId) {
      console.log("Within Semester");
      const newCourses = semesterBlocks[destination.droppableId].course_list;

      const [deletedCourse] = newCourses.splice(source.index, 1);
      newCourses.splice(destination.index, 0, deletedCourse);

      const newSemesterBlocks = [...semesterBlocks];
      newSemesterBlocks[destination.droppableId] = {
        ...semesterBlocks[destination.droppableId],
        course_list: newCourses,
      };
      // console.log(deletedCourse);
      // console.log(newCourses);
      if (currSchedule.id != "1") {
        const semesterRef = doc(firestore, "schedules", currSchedule.id);
        updateDoc(semesterRef, {
          semester_blocks: newSemesterBlocks,
        })
          .then(() => {
            setSemesterBlocks(newSemesterBlocks);
          })
          .catch((e) => {
            console.log("drag firebase update error");
            console.log(e);
          });
      }
    }
  };

  const adjustSemesterBlocks = (startY, endY) => {
    if (
      startY.$y == semesterBlocks[0].year &&
      endY.$y == semesterBlocks[semesterBlocks.length - 1].year
    )
      return;

    const semester_blocks = [...semesterBlocks];
    console.log(semester_blocks.length);

    //add at the end
    if (endY.$y - semester_blocks[semester_blocks.length - 1].year > 0) {
      console.log(
        "sem block: ",
        semester_blocks[semester_blocks.length - 1].year
      );
      console.log("new: ", endY.$y);

      let needYear = endY.$y - semester_blocks[semester_blocks.length - 1].year;
      console.log("need year", needYear);
      let total_semesters = needYear * 3;
      // const semester_blocks = [...semesterBlocks];

      console.log(semester_blocks.length);

      let term = "Summer";
      let orgEnd = semester_blocks[semester_blocks.length - 1].year;
      let addYear = 0;
      let ind = semester_blocks.length;
      for (let i = 0; i < total_semesters; i++) {
        term = "Summer";
        if (i % 3 == 0) {
          term = "Fall";
        } else if (i % 3 == 1) {
          term = "Spring";
          addYear++;
        }
        let semester = {
          id: ind + i,
          year: orgEnd + addYear,
          term: term,
          course_list: [],
          credit: 0,
        };
        semester_blocks[ind + i] = semester;
      }
      console.log(semester_blocks.length);
      console.log(semester_blocks);
    }

    //add at front
    if (semester_blocks[0].year - startY.$y > 0) {
      let orgStart = semester_blocks[0].year;
      let needYear = semester_blocks[0].year - startY.$y;
      console.log("need year", needYear);
      let total_semesters = needYear * 3;
      // const semester_blocks = [...semesterBlocks];

      console.log(semester_blocks.length);

      let term = "Summer";
      let minusYear = 0;
      for (let i = 0; i < total_semesters; i++) {
        term = "Summer";
        if (i % 3 == 0) {
          term = "Fall";
        } else if (i % 3 == 1) {
          term = "Spring";
          minusYear++;
        }
        let semester = {
          id: i,
          year: orgStart - minusYear,
          term: term,
          course_list: [],
          credit: 0,
        };
        semester_blocks.unshift(semester);
      }

      console.log(semester_blocks.length);

      for (let i = 0; i < semester_blocks.length; i++) {
        let semester = {
          id: i,
          year: semester_blocks[i].year,
          term: semester_blocks[i].term,
          course_list: semester_blocks[i].course_list,
          credit: semester_blocks[i].credit,
        };
        semester_blocks[i] = semester;
      }

      console.log(semester_blocks);
    }

    //delete at the front
    if (startY.$y - semester_blocks[0].year > 0) {
      let removeYear = startY.$y - semester_blocks[0].year;
      console.log("remove year", removeYear);
      let total_semesters = removeYear * 3;
      console.log("total semesters", total_semesters);
      // const semester_blocks = [...semesterBlocks];
      for (let i = 0; i < total_semesters; i++) {
        semester_blocks.shift();
      }
      for (let i = 0; i < semester_blocks.length; i++) {
        let semester = {
          id: i,
          year: semester_blocks[i].year,
          term: semester_blocks[i].term,
          course_list: semester_blocks[i].course_list,
          credit: semester_blocks[i].credit,
        };
        semester_blocks[i] = semester;
      }
      console.log(semester_blocks);
    }

    //delete at end
    if (semester_blocks[semester_blocks.length - 1].year - endY.$y > 0) {
      console.log(
        "sem block: ",
        semester_blocks[semester_blocks.length - 1].year
      );
      console.log("new: ", endY.$y);

      let removeYear =
        semester_blocks[semester_blocks.length - 1].year - endY.$y;
      console.log("remove year", removeYear);
      let total_semesters = removeYear * 3;
      // const semester_blocks = [...semesterBlocks];
      for (let i = 0; i < total_semesters; i++) {
        semester_blocks.pop();
      }
      console.log(semester_blocks);
    }

    if (currSchedule.id != "1") {
      const semesterRef = doc(firestore, "schedules", currSchedule.id);
      updateDoc(semesterRef, {
        start_term: Timestamp.fromDate(new Date(startY)),
        end_term: Timestamp.fromDate(new Date(endY)),
        semester_blocks: semester_blocks,
      })
        .then(() => {
          setSemesterBlocks(semester_blocks);
        })
        .catch((e) => {
          console.log("drag firebase update error");
          console.log(e);
        });
    }
  };

  const createNewSchedule = () => {
    console.log("new schedule");
    if (currentUser) {
      getDoc(doc(firestore, "users", currentUser.uid))
        .then((docSnapshot) => {
          console.log(docSnapshot.data().start_term);
          console.log(docSnapshot.data().end_term);
          let startDate = docSnapshot.data().start_term.toDate() || new Date();
          let startYear = startDate.getFullYear();
          let endDate =
            docSnapshot.data().end_term.toDate() ||
            new Date(startYear + 4, startDate.getMonth(), startDate.getDate());
          console.log(startDate);
          console.log(endDate);
          let total_semesters = (endDate.getFullYear() - startYear) * 3;
          let semester_blocks = [];
          let term = "Summer";
          let addYear = 0;
          for (let i = 0; i < total_semesters; i++) {
            term = "Summer";
            if (i % 3 == 0) {
              term = "Fall";
            } else if (i % 3 == 1) {
              term = "Spring";
              addYear++;
            }
            let semester: Semester = {
              id: i,
              year: startYear + addYear,
              term: term,
              course_list: [],
              credit: 0,
            };
            semester_blocks[i] = semester;
          }
          let newSchedule: Schedule = {
            name: "New Schedule",
            start_term: Timestamp.fromDate(startDate),
            end_term: Timestamp.fromDate(endDate),
            majors: docSnapshot.data().prefer_majors || [],
            minors: docSnapshot.data().prefer_minor || [],
            completed_courses: [],
            planned_courses: [],
            semester_blocks: semester_blocks,
          };
          // console.log(newSchedule);
          addDoc(collection(firestore, "schedules"), newSchedule).then(
            (document) => {
              const userDoc = doc(firestore, "users", currentUser.uid);
              updateDoc(userDoc, {
                schedule: arrayUnion(document.id),
              }).then(() => {
                const dup = schedulesList;
                dup.splice(schedulesList.length, 0, {
                  id: document.id,
                  name: "New Schedule",
                });
                setSchedulesList(dup);
                setCurrSchedule({ id: document.id, name: "New Schedule" });
                // setSemesterBlocks(newSchedule.semester_blocks);
              });
            }
          );
        })
        .catch((error) => {
          console.error("Fetch Data Error:", error);
        });
    } else {
      // TODO: local
    }
  };

  const deleteSchedule = (id) => {
    console.log("delete schedule");
    const check = confirm("Are you sure you want to delete this schedule?");
    if (check) {
      //update scheduleList
      const dup = schedulesList;
      const isId = (e) => e.id === id;
      const index = dup.findIndex(isId);
      // const index = dup.indexOf(id);
      console.log("delete schedule: ", index);
      dup.splice(index, 1);
      setSchedulesList(dup);

      //remove from the user's list of schedules
      if (currentUser) {
        const userDoc = doc(firestore, "users", currentUser.uid);
        updateDoc(userDoc, {
          schedule: arrayRemove(id),
        }).then(() => {
          //remove the schedule from firestore
          const scheduleRef = doc(firestore, "schedules", id);
          deleteDoc(scheduleRef);
          alert("Schedule Deleted.");
        });
        if (schedulesList.length > 0) {
          setCurrSchedule({
            id: schedulesList[0].id,
            name: schedulesList[0].name,
          });
          console.log("curr change");
        } else {
          setSemesterBlocks(SEMESTER_DATA);
          console.log("tmp change");
        }
      }
    } else {
      alert("Schedule Not Deleted.");
    }
  };

  const changeScheduleName = () => {
    let newName = prompt("Enter new name");
    if (newName) {
      const userRef = doc(firestore, "schedules", currSchedule.id);
      updateDoc(userRef, {
        name: newName,
      })
        .then(() => {
          const isId = (e) => e.id === currSchedule.id;
          const dup = [...schedulesList];
          const index = dup.findIndex(isId);
          dup[index] = {
            ...schedulesList[index],
            name: newName,
          };
          setSchedulesList(dup);
          setCurrSchedule({ ...currSchedule, name: newName });
        })
        .catch((e) => {
          console.log("update schedule array error");
          console.log(e);
        });
    } else {
      alert("Schedule name cannot be empty.");
    }
  };

  const handleOpenReqModal = () => {
    setReqModalOpen(true);
  };

  const handleCloseReqModal = () => {
    setReqModalOpen(false);
  };

  const onReqSearch = (name, courses) => {
    // console.log(name)
    // console.log(courses)
    setFilterName(name);
    setFilterCourses(courses);
    setReqModalOpen(false);
  };

  return (
    <div className="DegreeOverview">
      <NavBar
        darkmode={darkmode}
        setDarkmode={setDarkmode}
        schedulesList={schedulesList}
        createNewSchedule={createNewSchedule}
        setCurrSchedule={setCurrSchedule}
        setUserOwnSchedule={setUserOwnSchedule}
      />

      <div className="DegreeContent">
        <DragDropContext onDragEnd={handleDragDrop}>
          {userOwnSchedule ? (
            <>
              <ScheduleView
                id={currSchedule.id}
                name={currSchedule.name}
                semesterBlocks={semesterBlocks}
                setParentSemesterBlocks={adjustSemesterBlocks}
                viewOnly={!userOwnSchedule}
                completed={completed}
                planned={planned}
                total={total}
                scheduleList={schedulesList}
                setscheduleList={setSchedulesList}
                deleteSchedule={deleteSchedule}
                changeScheduleName={changeScheduleName}
                completedCourses={completedCourses}
              />
              <ThemeProvider theme={mode}>
                <div className="ScheduleSide">
                  <button
                    className="mediumBtn goldBtn"
                    onClick={handleOpenReqModal}
                  >
                    <h3>Requirement</h3>
                  </button>
                  <ReqModal
                    open={reqModalOpen}
                    handleClose={handleCloseReqModal}
                    onReqSearch={onReqSearch}
                  />
                  <Searchbar
                    parentSearch={searchResult}
                    updateParentSearch={setSearchResult}
                    viewOnly={!userOwnSchedule}
                    filterCourses={filterCourses}
                    setFilterCourses={setFilterCourses}
                    filterName={filterName}
                    setFilterName={setFilterName}
                  />{" "}
                  {/* <FriendsList/> */}
                  {/* <CopyScheduleButton scheduleID="g5ZWE0nw9llkRznXVopn"/> */}
                </div>
              </ThemeProvider>
            </>
          ) : (
            <ThemeProvider theme={mode}>
              <Friends
                scheduleList={schedulesList}
                setscheduleList={setSchedulesList}
              />
            </ThemeProvider>
          )}
        </DragDropContext>
      </div>
    </div>
  );
}
