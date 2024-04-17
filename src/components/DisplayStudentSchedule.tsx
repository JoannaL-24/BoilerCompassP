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
import ScheduleView from "../components/ScheduleView/ScheduleView";
import { isTermInPast, getSatisfied, Schedule } from "../models/BoilerCompass";
import { CS } from "../models/CS";
import { DragDropContext } from "react-beautiful-dnd";
import zIndex from "@mui/material/styles/zIndex";

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

const DisplayStudentSchedule = ({ selectedUser }) => {
  const handleDragDrop = (result) => {
    console.log("drag drop");
  };
  let name = "";
  let sid = "";

  const [completedCourses, setCompletedCourses] = useState([]);
  const [semesterRender, setSemesterRender] = useState([]);
  const [semesterBlocks, setSemesterBlocks] = useState(SEMESTER_DATA);
  const [scheduleList, setscheduleList] = useState({
    currIndex: 0,
    currId: "1",
    currName: "",
    list: [],
  });
  const [completed, setCompleted] = useState(0);
  const [planned, setPlanned] = useState(0);
  const [total, setTotal] = useState(100);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        if (!selectedUser) {
          console.error("No user selected");
          return;
        }

        const userDocRef = doc(firestore, "users", selectedUser.uid);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          const scheduleIds = userData.schedule || []; // Array of schedule IDs

          // Fetch schedule data for each schedule id

          let i = -1;
          for (const id of scheduleIds) {
            sid = id;
            i++;
            const scheduleDocRef = doc(firestore, "schedules", id);
            const scheduleDocSnapshot = await getDoc(scheduleDocRef);
            if (scheduleDocSnapshot.exists()) {
              const scheduleData = scheduleDocSnapshot.data();
              setCompletedCourses(scheduleData.completed_courses);
              let planned = getSatisfied(
                CS,
                new Set(scheduleData.planned_courses)
              );
              setPlanned(planned[0]);
              let completed = getSatisfied(CS, new Set(completedCourses));
              setTotal(completed[1]);
              setCompleted(completed[0]);
              name = scheduleData.name;
              const index = i;
              const semesterblock = scheduleData.semester_blocks;
              setscheduleList({
                ...scheduleList,
                currId: index.toString(),
                currName: name,
              });
              setSemesterBlocks(semesterblock);
            }
          }

          console.log("user is " + selectedUser.name);
          // display the semester blocks
          console.log("Semester Blocks: ", semesterBlocks);
        } else {
          console.log("User not found");
        }
      } catch (error) {
        console.error("Error fetching schedule:", error);
      }
    };

    fetchSchedule();
  }, [selectedUser]);

  return (
    <div>
      <DragDropContext onDragEnd={handleDragDrop}>
        <div style={{ height: "500px", overflowY: "auto", zIndex: "-9999" }}>
          <ScheduleView
            name={name}
            id={sid}
            semesterBlocks={semesterBlocks}
            setParentSemesterBlocks={null}
            viewOnly={true}
            completed={completed}
            planned={planned}
            total={total}
            scheduleList={scheduleList}
            setscheduleList={setscheduleList}
          />
        </div>
      </DragDropContext>
    </div>
  );
};

export default DisplayStudentSchedule;
