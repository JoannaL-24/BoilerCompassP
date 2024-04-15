import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar/NavBar";
import ScheduleView from "../components/ScheduleView/ScheduleView";
import './DegreePlanner.css';
// firebase imports
import { useAuth } from '../components/contexts/AuthContext.tsx'
import { doc, getDoc, updateDoc, arrayRemove, Timestamp, arrayUnion, DocumentReference, DocumentData } from "firebase/firestore";
import { firestore } from '../models/firebase.ts';
import { DragDropContext } from "react-beautiful-dnd";
import RemoteUserdata from '../models/RemoteUserData';
import { isTermInPast, getSatisfied, Schedule } from '../models/BoilerCompass';
import { CS } from '../models/CS';
// sidebar import
import "../components/ScheduleSide/ScheduleSide.css";
import Searchbar from "components/Searchbar.js";
// search bar input
import "../components/Searchbar.css";
import { ThemeProvider, createTheme } from "@mui/material";
import UserData from "models/UserData.ts";
import ReqModal from "components/ReqModal";

//test, added in sidebar area
import FriendsList from "components/FriendsList.tsx";
import CopyScheduleButton from "components/CopyScheduleButton.tsx";
import ChangeScheduleName from "components/ChangeScheduleName.tsx";


// temperary data for semester_blocks in Schedule
const SCHEDULE_DATA = {
    name: "Schedule1",
    start_term: new Date("2022-08-19T24:00:00.000Z"),
    end_term: new Date("2026-05-03T24:00:00.000Z"),
    semester_blocks: [
        {
            id: 0,
            year: 2022,
            term: "Fall",
            course_list: [
                {
                    id: "1",
                    number: "CS25200",
                    description: "something",
                    credit: 3,
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
}
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
]
type Props = {
    darkmode: boolean;
    setDarkmode: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DegreePlanner({ darkmode, setDarkmode }: Props) {
    //get current user and mode preference
    const { currentUser } = useAuth();
    const userData: UserData = new RemoteUserdata();
    const [scheduleList, setscheduleList] = useState({
        currIndex: 0,
        currId: "1",
        currName: "",
        list: []
    });
    const [semesterBlocks, setSemesterBlocks] = useState(SEMESTER_DATA);
    const [searchResult, setSearchResult] = useState([]);
    // progress bar data
    const [completed, setCompleted] = useState(0);
    const [total, setTotal] = useState(100);
    const [planned, setPlanned] = useState(0);
    const [reqModalOpen, setReqModalOpen] = useState(false);
    //schedule mode
    const [viewOnly, setViewOnly] = useState(false);
    const [userOwnSchedule, setUserOwnSchedule] = useState(true); // true == user's own schedule, false == friend's schedule
    const [friendSchedule, setFriendSchedule] = useState(null);

    const [completedCourses, setCompletedCourses] = useState([])
    const [courseGrades, setCourseGrades] = useState({})

    // get firebase data (dark mode & schedule) if the user is a firebase user
    useEffect(() => {
        if (currentUser) {
            getDoc(doc(firestore, "users", currentUser.uid))
                .then((docSnapshot) => {
                    setDarkmode(docSnapshot.data().dark_mode);
                    setscheduleList({ ...scheduleList, list: docSnapshot.data().schedule });
                    setCompletedCourses(docSnapshot.data().completed_courses)
                });
        }
    }, [currentUser]);

    // get the user's all schedule from firebase when possible
    // for nav bar schedule selection
    useEffect(() => {
        if (scheduleList.list.length > 0) {
            getDoc(doc(firestore, "schedules", scheduleList.list[scheduleList.currIndex]))
                .then((scheduleSnap) => {
                    setscheduleList({ ...scheduleList, currId: scheduleList.list[scheduleList.currIndex], currName: scheduleSnap.data().name });
                    setSemesterBlocks(scheduleSnap.data().semester_blocks);

                })
                .catch((error) => {
                    console.log(error);
                    // setSemesterBlocks(SEMESTER_DATA);
                })
        }
    }, [scheduleList.list]);

    // useEffect(() => {
    //     console.log(scheduleList);
    // }, [scheduleList]);

    useEffect(() => {
        if (scheduleList.currId != "1") calculateProgress();
    }, [scheduleList.currId])

    function calculateProgress() {
        if (scheduleList.currId == "1") return;
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
            getDoc(doc(firestore, "schedules", scheduleList.currId))
                .then((docSnapshot) => {
                    let planned = getSatisfied(CS, new Set(docSnapshot.data().planned_courses));
                    setPlanned(planned[0]);
                    let completed = getSatisfied(CS, new Set(docSnapshot.data().completed_courses));
                    setCompleted(completed[0]);
                    setTotal(completed[1]);
                })
        }
    }

    var mode_str;
    if (darkmode) {
        mode_str = "dark";
    }
    else {
        mode_str = "light"
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
        }
        else if (currDate.getFullYear() < year) {
            return 0;
        }
        else {
            if (term === "Fall") {
                if (currDate.getMonth() == 12) {
                    return 1;
                }
                else {
                    return 0;
                }
            }
            else if (term === "Spring") {
                if (currDate.getMonth() >= 5) {
                    return 1;
                }
                else {
                    return 0;
                }
            }
            else {
                if (currDate.getMonth() >= 9) {
                    return 1;
                }
                else {
                    return 0;
                }
            }
        }
    }

    const addCompletedCourse = (id) => {
      const s = new Set(completedCourses)
      if (!s.has(id)) {
        const c = completedCourses
        c.push(id)
        setCompletedCourses(c)
        userData.put("completed_courses", c)
      } else {
        userData.put("completed_courses", completedCourses)
      }
    }

    const removeCompletedCourse = (id) => {
      const s = new Set(completedCourses)
      if (s.has(id)) {
        s.delete(id)
        setCompletedCourses([...s])
        userData.put("completed_courses", [...s])
      } else {
        userData.put("completed_courses", completedCourses)
      }
    }

    const handleDragDrop = (result) => {
        const { source, destination } = result;
        console.log("drag occured");
        console.log(result);

        // delete the course from semester
        if (!destination && source.droppableId !== "ROOT") {
            console.log("Semester to Null");
            const newSourceCourses = semesterBlocks[source.droppableId].course_list;
            let cr = semesterBlocks[source.droppableId].credit;

            const [deletedCourse] = newSourceCourses.splice(source.index, 1);
            cr = cr - deletedCourse.credit;
            if (cr < 12) { alert("Less than 12 credits"); }
            if (cr > 18) { alert("More than 18 credits"); }

            const newSemesterBlocks = [...semesterBlocks];
            newSemesterBlocks[source.droppableId] = {
                ...semesterBlocks[source.droppableId],
                course_list: newSourceCourses,
                credit: cr,
            };
            // update the change in firebase then update the UI if firebase update successfully
            if (scheduleList.currId != "1") {
                const semesterRef = doc(firestore, "schedules", scheduleList.currId);
                updateDoc(semesterRef, {
                    "semester_blocks": newSemesterBlocks
                })
                    .then(() => {
                        setSemesterBlocks(newSemesterBlocks);
                        // delete the course from the planed / completed courses in firebase
                        updateDoc(semesterRef, {
                            "planned_courses": arrayRemove(deletedCourse.id),
                            "completed_courses": arrayRemove(deletedCourse.id)
                        });
                        calculateProgress();
                        return;
                    })
                    .catch((e) => {
                        console.log("drag firebase update error");
                        console.log(e);
                        return;
                    })
            }
        }

        // drags that do not affect the schedules and search bar
        if (!destination) return;
        if (destination.droppableId === "ROOT") return;
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        // from the search result to semester
        if (source.droppableId === "ROOT" && searchResult.length > 0) {
            console.log("Root to Semester");
            const newSourceCourses = searchResult;
            const newDestinationCourses = semesterBlocks[destination.droppableId].course_list;
            let cr = semesterBlocks[destination.droppableId].credit;

            const [deletedCourse] = newSourceCourses.splice(source.index, 1);
            newDestinationCourses.splice(destination.index, 0, deletedCourse);

            cr = cr + deletedCourse.credit;
            if (cr > 18) { alert("More than 18 credits"); }

            const newSemesterBlocks = [...semesterBlocks];
            newSemesterBlocks[destination.droppableId] = {
                ...semesterBlocks[destination.droppableId],
                course_list: newDestinationCourses,
                credit: cr,
            };
            // console.log(deletedCourse);
            // console.log(newSourceCourses);
            console.log(newSemesterBlocks);
            if (scheduleList.currId != "1") {
                const semesterRef = doc(firestore, "schedules", scheduleList.currId);
                updateDoc(semesterRef, {
                    "semester_blocks": newSemesterBlocks,
                })
                    .then(() => {
                        setSearchResult(newSourceCourses);
                        setSemesterBlocks(newSemesterBlocks);
                        if (ifYearPassed(semesterBlocks[destination.droppableId].year, semesterBlocks[destination.droppableId].term)) {
                            console.log("update completed");
                            updateDoc(semesterRef, {
                                "completed_courses": arrayUnion(deletedCourse.id)
                            });
                            addCompletedCourse(deletedCourse.id)
                        } else {
                            console.log("update planned");
                            updateDoc(semesterRef, {
                                "planned_courses": arrayUnion(deletedCourse.id)
                            });
                        }
                        calculateProgress();
                        return;
                    })
                    .catch((e) => {
                        console.log("drag firebase update error");
                        console.log(e);
                    })
            }
        }
        // from semester to another semester
        else if (source.droppableId != destination.droppableId) {
            console.log("Semester to Semester");
            const newSourceCourses = semesterBlocks[source.droppableId].course_list;
            let cr_source = semesterBlocks[source.droppableId].credit;
            const newDestinationCourses = semesterBlocks[destination.droppableId].course_list;
            let cr_dest = semesterBlocks[destination.droppableId].credit;

            const [deletedCourse] = newSourceCourses.splice(source.index, 1);
            newDestinationCourses.splice(destination.index, 0, deletedCourse);
            cr_source = cr_source - deletedCourse.credit;
            cr_dest = cr_dest + deletedCourse.credit;
            if (cr_source < 12) { alert("Less than 12 credits"); }
            if (cr_source > 18) { alert("More than 18 credits"); }
            if (cr_dest < 12) { alert("Less than 12 credits"); }
            if (cr_dest > 18) { alert("More than 18 credits"); }

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
            if (scheduleList.currId != "1") {
                const semesterRef = doc(firestore, "schedules", scheduleList.currId);
                updateDoc(semesterRef, {
                    "semester_blocks": newSemesterBlocks
                })
                    .then(() => {
                        setSemesterBlocks(newSemesterBlocks);
                        if (ifYearPassed(semesterBlocks[destination.droppableId].year, semesterBlocks[destination.droppableId].term)) {
                            console.log("add completed, delete planned");
                            updateDoc(semesterRef, {
                                "completed_courses": arrayUnion(deletedCourse.id),
                                "planned_courses": arrayRemove(deletedCourse.id)
                            });
                            addCompletedCourse(deletedCourse.id)
                        } else {
                            console.log("delete completed, add planned");
                            updateDoc(semesterRef, {
                                "completed_courses": arrayRemove(deletedCourse.id),
                                "planned_courses": arrayUnion(deletedCourse.id)
                            });
                            removeCompletedCourse(deletedCourse.id)
                        }
                        calculateProgress();
                        return;
                    })
                    .catch((e) => {
                        console.log("drag firebase update error");
                        console.log(e);
                    })
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
            if (scheduleList.currId != "1") {
                const semesterRef = doc(firestore, "schedules", scheduleList.currId);
                updateDoc(semesterRef, {
                    "semester_blocks": newSemesterBlocks
                })
                    .then(() => {
                        setSemesterBlocks(newSemesterBlocks);
                    })
                    .catch((e) => {
                        console.log("drag firebase update error");
                        console.log(e);
                    })
            }
        }
    }

    const adjustSemesterBlocks = (startY, endY) => {
        if (startY.$y == semesterBlocks[0].year && endY.$y == semesterBlocks[semesterBlocks.length - 1].year)
            return;
        let needYear = endY.$y - semesterBlocks[semesterBlocks.length - 1].year;
        console.log("need year", needYear);
        if (needYear > 0) {
            let total_semesters = needYear * 3;
            const semester_blocks = [...semesterBlocks];
            let term = "Summer";
            let addYear = 0;
            let ind = semesterBlocks.length;
            for (let i = 0; i < total_semesters; i++) {
                term = "Summer";
                if (i % 3 == 0) {
                    term = "Fall";
                }
                else if (i % 3 == 1) {
                    term = "Spring";
                    addYear++;
                }
                let semester = {
                    id: ind + i,
                    year: semesterBlocks[semesterBlocks.length - 1].year + addYear,
                    term: term,
                    course_list: [],
                    credit: 0
                }
                semester_blocks[ind + i] = semester;
            }
            console.log(semester_blocks);
            if (scheduleList.currId != "1") {
                const semesterRef = doc(firestore, "schedules", scheduleList.currId);
                updateDoc(semesterRef, {
                    "start_term": Timestamp.fromDate(new Date(startY)),
                    "end_term": Timestamp.fromDate(new Date(endY)),
                    "semester_blocks": semester_blocks
                })
                    .then(() => {
                        setSemesterBlocks(semester_blocks);
                    })
                    .catch((e) => {
                        console.log("drag firebase update error");
                        console.log(e);
                    })
            }
        }
    }

    const createNewSchedule = () => {
        console.log("new schedule");
        if (currentUser) {
            // userData.get
            // let newSchedule: Schedule = {
            //     name: "New Schedule",
            //     start_term: ,
            //     end_term: undefined,
            //     semester_blocks: [],
            //     majors: [],
            //     minors: []
            // };
            // addDoc(collection(firestore, "schedules"), userinfo.schedule)
            //   .then((document) => {
            //     userData.put("schedule", [document.id]);
            //   })
            //   .catch((error) => {
            //     console.log(error);
            //   })
        }
        else {
            // TODO: local
        }
    }

    const handleOpenReqModal = () => {
        setReqModalOpen(true);
    }

    const handleCloseReqModal = () => {
        setReqModalOpen(false);
    }

    return (
        <div className="DegreeOverview">
            <NavBar
                darkmode={darkmode}
                setDarkmode={setDarkmode}
                schedules={scheduleList}
                createNewSchedule={createNewSchedule}
                viewOnly={viewOnly}
            />
            <div className="DegreeContent">
                <DragDropContext onDragEnd={handleDragDrop}>
                    { userOwnSchedule &&
                    <ScheduleView name={scheduleList.currName} id={scheduleList.currId} semesterBlocks={semesterBlocks} setParentSemesterBlocks={adjustSemesterBlocks} viewOnly={viewOnly} completed={completed} planned={planned} total={total} completedCourses={completedCourses} courseGrades={courseGrades} scheduleList={scheduleList} setscheduleList={setscheduleList}/> }
                    { !userOwnSchedule && friendSchedule &&
                    <ScheduleView name={friendSchedule.name} id={friendSchedule.ID} semesterBlocks={friendSchedule.semester_blocks} setParentSemesterBlocks={adjustSemesterBlocks} viewOnly={viewOnly} completed={friendSchedule.completed} planned={friendSchedule.planned} total={friendSchedule.total} scheduleList={scheduleList} setscheduleList={setscheduleList}/>}
                    <ThemeProvider theme={mode}>
                        <div className="ScheduleSide" style={darkmode ? { backgroundColor: '#3b3a39' } : { backgroundColor: '#f5f3eb' }}>
                            <button className="mediumBtn goldBtn" onClick={handleOpenReqModal}><h3>Requirement</h3></button>
                            <ReqModal open={reqModalOpen} handleClose={handleCloseReqModal} />
                            <Searchbar parentSearch={searchResult} updateParentSearch={setSearchResult} viewOnly={viewOnly} />
                            {/* <FriendsList/> */}
                            {/* <CopyScheduleButton scheduleID="g5ZWE0nw9llkRznXVopn"/> */}
                            {/* <ChangeScheduleName scheduleID={scheduleList.currId}/> */}
                        </div>
                    </ThemeProvider>
                </DragDropContext>
            </div>
        </div>)
}
