import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar/NavBar";
import ScheduleView from "../components/ScheduleView/ScheduleView";
import SceduleSide from "../components/ScheduleSide/ScheduleSide";
import './DegreePlanner.css';
// firebase imports
import { useAuth } from '../components/contexts/AuthContext.tsx'
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { firestore } from '../models/firebase.ts';
// react beautiful dnd imports
import { DragDropContext } from "react-beautiful-dnd";      

// sidebar import
import "../components/ScheduleSide/ScheduleSide.css";
import Searchbar from "components/Searchbar.js";
// search bar input
import "../components/Searchbar.css";
import Semester from "components/Semester/Semester.tsx";

// temperary data for semester_blocks in Schedule
const DATA = [
    {
        id: 1,
        year: 2022,
        term: "Fall",
        course_list: [],
    },
    {
        id: 2,
        year: 2023,
        term: "Spring",
        course_list: [],
    },
    {
        id: 3,
        year: 2023,
        term: "Summer",
        course_list: [],
    },
    {
        id: 4,
        year: 2023,
        term: "Fall",
        course_list: [],
    },
    {
        id: 5,
        year: 2024,
        term: "Spring",
        course_list: [],
    },
    {
        id: 6,
        year: 2024,
        term: "Summer",
        course_list: [],
    },
    {
        id: 7,
        year: 2024,
        term: "Fall",
        course_list: [],
    },
    {
        id: 8,
        year: 2025,
        term: "Spring",
        course_list: [],
    },
    {
        id: 9,
        year: 2025,
        term: "Summer",
        course_list: [],
    },
    {
        id: 10,
        year: 2025,
        term: "Fall",
        course_list: [],
    },
    {
        id: 11,
        year: 2026,
        term: "Spring",
        course_list: [],
    },
    {
        id: 12,
        year: 2026,
        term: "Summer",
        course_list: [],
    },
]

export default function DegreePlanner() {
    // get current user and mode preference
    const { currentUser } = useAuth();
    const [darkmode, setDarkmode] = useState<boolean>(null);
    const [semesterBlocks, setSemesterBlocks] = useState(DATA);
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
                });
        }
    }, [currentUser]);

    const handleDragDrop = (result) => {
        const { source, destination } = result;
        console.log("drag occured");
        console.log(result);
        if (!destination) return;
        if (destination.droppableId === "ROOT") return;
        if (source.droppableId === destination.droppableId && source.index === destination.index)
            return;

        if (source.droppableId === "ROOT" && searchResult.length > 0) {
            console.log("Root to Semester");
            const newSourceCourses = searchResult;
            const newDestinationCourses = semesterBlocks[destination.droppableId-1].course_list;

            const [deletedCourse]  = newSourceCourses.splice(source.index, 1);
            newDestinationCourses.splice(destination.index, 0, deletedCourse);

            const newSemesterBlocks = [...semesterBlocks];
            newSemesterBlocks[destination.droppableId-1] = {
                ...semesterBlocks[destination.droppableId-1],
                course_list: newDestinationCourses,
            };
            // console.log(deletedCourse);
            // console.log(newSourceCourses);
            // console.log(newSemesterBlocks);
            setSearchResult(newSourceCourses);
            setSemesterBlocks(newSemesterBlocks);
        }
    }

    const calculateProgress = () => {
        // get numbers for calculating degree progress
        const userData: UserData = new RemoteUserdata();
        const { currentUser } = useAuth();
        if (currentUser) {
            // get completed and total
            userData.get("completed_courses")
            .then((completed) => {
                let c = getSatisfied(CS, completed);
                setCompleted(c[0]);
                setTotal(c[1]);
            })
            
            // get planned
            userData.get("planned_courses")
            .then((planned) => {
                let c = getSatisfied(CS, planned);
                setPlanned(c[0]);
            })
        } 
    }

    return (
        <div className="DegreeOverview">
            <NavBar
                darkmode={darkmode}
                setDarkmode={setDarkmode} />
            <div className="DegreeContent">
                <DragDropContext onDragEnd={handleDragDrop}>
                <ScheduleView semesterBlocks={semesterBlocks} completed={completed} planned={planned} total={total} />
                <div className="ScheduleSide">
                    <button className="mediumBtn goldBtn"><h3>Requirement</h3></button>
                    <Searchbar parentSearch={searchResult} updateParentSearch={setSearchResult} />
                </div>
                </DragDropContext>
            </div>

        </div>
    )
}