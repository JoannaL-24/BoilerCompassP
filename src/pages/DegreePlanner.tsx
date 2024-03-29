import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar/NavBar";
import ScheduleView from "../components/ScheduleView/ScheduleView";
import './DegreePlanner.css';
// firebase imports
import { useAuth } from '../components/contexts/AuthContext.tsx'
import { doc, getDoc, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";
import { firestore } from '../models/firebase.ts';
import { DragDropContext } from "react-beautiful-dnd";
import RemoteUserdata from '../models/RemoteUserData';
import { getSatisfied } from '../models/BoilerCompass';
import { CS } from '../models/CS';
// sidebar import
import "../components/ScheduleSide/ScheduleSide.css";
import Searchbar from "components/Searchbar.js";
// search bar input
import "../components/Searchbar.css";
import { ThemeProvider, createTheme } from "@mui/material";
import UserData from "models/UserData.ts";

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
    // const [darkmode, setDarkmode] = useState<boolean>(null);
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

    useEffect(() => {
        if (currentUser) {
            const user_doc = getDoc(doc(firestore, "users", currentUser.uid))
                .then((docSnapshot) => {
                    setDarkmode(docSnapshot.data().dark_mode);
                    setscheduleList({ ...scheduleList, list: docSnapshot.data().schedule });
                });
        }
    }, [currentUser]);

    useEffect(() => {
        if (scheduleList.list.length > 0) {
            getDoc(doc(firestore, "schedules", scheduleList.list[scheduleList.currIndex]))
                .then((scheduleSnap) => {
                    setscheduleList({ ...scheduleList, currId: scheduleList.list[scheduleList.currIndex], currName: scheduleSnap.data().name });
                    setSemesterBlocks(scheduleSnap.data().semester_blocks);
                })
                .catch((error) => {
                    console.log(error);
                    setSemesterBlocks(SEMESTER_DATA);
                })
        }
        console.log(scheduleList);
    }, [scheduleList.list]);

    useEffect(() => {
        if (scheduleList.currId != 1) calculateProgress();
    }, [scheduleList.currId])

    function calculateProgress() {
        // get numbers for calculating degree progress
        console.log("called");
        if (currentUser) {
            // get completed and total
            userData.get("completed_courses")
            .then((completed) => {
                let c = getSatisfied(CS, new Set(completed));
                setCompleted(c[0]);
                setTotal(c[1]);
            })
            
            // get planned
            // userData.get("planned_courses")
            // .then((planned) => {
            //     let c = getSatisfied(CS, new Set(planned));
            //     setPlanned(c[0]);
            // })
            console.log("jenny start");
            const user_doc = getDoc(doc(firestore, "schedules", scheduleList.currId))
                .then((docSnapshot) => {
                    let c = getSatisfied(CS, new Set(docSnapshot.data().planned_courses));
                    setPlanned(c[0]);
                })
            // console.log(planned);
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

    const handleDragDrop = (result) => {
        const { source, destination } = result;
        console.log("drag occured");
        // console.log(result);
        // delete the course from semester
        if (!destination && source.droppableId !== "ROOT") {
            console.log("Semester to Null");
            const newSourceCourses = semesterBlocks[source.droppableId].course_list;
            let cr = semesterBlocks[source.droppableId].credit;

            const [deletedCourse] = newSourceCourses.splice(source.index, 1);
            cr = cr - deletedCourse.credit;

            const newSemesterBlocks = [...semesterBlocks];
            newSemesterBlocks[source.droppableId] = {
                ...semesterBlocks[source.droppableId],
                course_list: newSourceCourses,
                credit: cr,
            };
            if (scheduleList.currId != "1") {
                const semesterRef = doc(firestore, "schedules", scheduleList.currId);
                updateDoc(semesterRef, {
                    "semester_blocks": newSemesterBlocks
                })
                    .then(() => {
                        setSemesterBlocks(newSemesterBlocks);
                        return;
                    })
                    .catch((e) => {
                        console.log("drag firebase update error");
                        console.log(e);
                        return;
                    })
                updateDoc(semesterRef, {
                    planned_courses: arrayRemove(deletedCourse.id)
                })
                    .catch((e) => {
                        console.log("drag firebase update error");
                        console.log(e);
                    })
            }
        }
        if (!destination)
            return;
        if (destination.droppableId === "ROOT") return;
        if (source.droppableId === destination.droppableId && source.index === destination.index)
            return;

        // from the search result to semester
        if (source.droppableId === "ROOT" && searchResult.length > 0) {
            console.log("Root to Semester");
            const newSourceCourses = searchResult;
            const newDestinationCourses = semesterBlocks[destination.droppableId].course_list;
            let cr = semesterBlocks[destination.droppableId].credit;

            const [deletedCourse] = newSourceCourses.splice(source.index, 1);

            // console.log("deletedCourse:")
            // console.log(deletedCourse.credit);

            cr = cr + deletedCourse.credit;
            newDestinationCourses.splice(destination.index, 0, deletedCourse);

            const newSemesterBlocks = [...semesterBlocks];
            newSemesterBlocks[destination.droppableId] = {
                ...semesterBlocks[destination.droppableId],
                course_list: newDestinationCourses,
                credit: cr,
            };

            // console.log(newSourceCourses);
            // console.log(newSemesterBlocks);
            if (scheduleList.currId != "1") {
                const semesterRef = doc(firestore, "schedules", scheduleList.currId);
                updateDoc(semesterRef, {
                    "semester_blocks": newSemesterBlocks
                })
                    .then(() => {
                        setSearchResult(newSourceCourses);
                        setSemesterBlocks(newSemesterBlocks);
                    })
                    .catch((e) => {
                        console.log("drag firebase update error");
                        console.log(e);
                    })
                updateDoc(semesterRef, {
                    planned_courses: arrayUnion(deletedCourse.id)
                })
                    .catch((e) => {
                        console.log("drag firebase update error");
                        console.log(e);
                    })
            }
        }
        // from semester to another semester
        else if (source.droppableId != destination.droppableI) {
            console.log("Semester to Semester");
            const newSourceCourses = semesterBlocks[source.droppableId].course_list;
            let cr_source = semesterBlocks[source.droppableId].credit;
            const newDestinationCourses = semesterBlocks[destination.droppableId].course_list;
            let cr_dest = semesterBlocks[destination.droppableId].credit;

            const [deletedCourse] = newSourceCourses.splice(source.index, 1);
            cr_source = cr_source - deletedCourse.credit;
            cr_dest = cr_dest + deletedCourse.credit;
            newDestinationCourses.splice(destination.index, 0, deletedCourse);

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
        calculateProgress();
    }

    return (
        <div className="DegreeOverview">
            <NavBar
                darkmode={darkmode}
                setDarkmode={setDarkmode} />
            <div className="DegreeContent">
                <DragDropContext onDragEnd={handleDragDrop}>
                    <ScheduleView name={scheduleList.currName} semesterBlocks={semesterBlocks} completed={completed} planned={planned} total={total} />
                    <ThemeProvider theme={mode}>
                        <div className="ScheduleSide" style={darkmode ? { backgroundColor: '#3b3a39' } : { backgroundColor: '#f5f3eb' }}>
                            <button className="mediumBtn goldBtn"><h3>Requirement</h3></button>
                            <Searchbar parentSearch={searchResult} updateParentSearch={setSearchResult} />
                        </div>
                    </ThemeProvider>
                </DragDropContext>
            </div>
        </div>
    )
}