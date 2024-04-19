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
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`schedule-tabpanel-${index}`}
      aria-labelledby={`schedule-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `schedule-tab-${index}`,
    "aria-controls": `schedule-tabpanel-${index}`,
  };
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
];

const DisplayStudentSchedule = ({ selectedUser }) => {
  const [scheduleDataArray, setscheduleDataArray] = useState([]); //stores everything of a schedule
  const [num, setNum] = useState(0); //num is for how many schedules there are
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const handleDragDrop = (result) => {
    console.log("drag drop");
  };

  let sid = "";
  let len = 0;

  const [completedCourses, setCompletedCourses] = useState([]);
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
  const [arraylen, setarraylen] = useState(0);
  const [name, setname] = useState("");
  console.log("scheduledataarray: " + scheduleDataArray.length);

  useEffect(() => {
    if (!selectedUser) {
      console.error("No user selected");
      return;
    }
    const userDocRef = doc(firestore, "users", selectedUser.uid);
    getDoc(userDocRef)
      .then((userDocSnapshot) => {
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          const scheduleIds = userData.schedule || [];
          //len = scheduleIds.length;
          len = userData.schedule.length;
          console.log("len is " + len);
          //setNum(len); can also do it here

          let i = -1;
          var temp_array = new Array(len); // Temp array to store all of the schedules before setting scheduleDataArray
          scheduleIds.map((id) => {
            sid = id;
            // i++;
            const scheduleDocRef = doc(firestore, "schedules", id);
            getDoc(scheduleDocRef)
              .then((scheduleDocSnapshot) => {
                if (scheduleDocSnapshot.exists()) {
                  i++; // Increment iteration
                  const scheduleData = scheduleDocSnapshot.data();

                  setCompletedCourses(scheduleData.completed_courses);
                  setPlanned(
                    getSatisfied(CS, new Set(scheduleData.planned_courses))[0]
                  );
                  let completed = getSatisfied(CS, new Set(completedCourses));
                  setTotal(completed[1]);
                  setCompleted(completed[0]);
                  setname(scheduleData.name);
                  const index = i;
                  console.log("i:" + i);
                  const semesterblock = scheduleData.semester_blocks;
                  setscheduleList({
                    ...scheduleList,
                    currId: index.toString(),
                    currName: name,
                  });
                  setSemesterBlocks(semesterblock);
                  console.log("Name before setting: " + scheduleData.name);
                  console.log("Before pushing index:" + i + temp_array);
                  temp_array[index] = {
                    ScheduleName: scheduleData.name,
                    scheduleid: scheduleIds[index],
                    semesterBlockstemp: scheduleData.semester_blocks,
                    setParentSemesterBlocks: null,
                    viewonly: true,
                    completedtemp: completed[0],
                    plannedtemp: getSatisfied(
                      CS,
                      new Set(scheduleData.planned_courses)
                    )[0],
                    totaltemp: completed[1],
                    schedulelisttemp: scheduleList,
                    setscheduleList: { setscheduleList },
                  };
                  console.log(
                    "Temp array: " + index + " " + JSON.stringify(temp_array)
                  );
                  setarraylen((prevArraylen) => prevArraylen + 1);
                }
              })
              .catch((error) => {
                console.error("Error fetching schedule:", error);
              });
            setscheduleDataArray(temp_array);
            setNum(len);
          });
          // setscheduleDataArray(temp_array);
          // setNum(len);
        } else {
          console.log("User not found");
        }
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      });
  }, [selectedUser]);

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="basic tabs example"
        >
          {num === 0 ? (
            <Tab label="Empty Schedule" />
          ) : (
            Array.from({ length: num }, (_, index) => (
              <Tab
                key={index}
                label={
                  scheduleDataArray[index]
                    ? scheduleDataArray[index].ScheduleName
                    : "nothing"
                }
                {...a11yProps(index)}
              />
            ))
          )}
        </Tabs>
      </Box>

      {num === 0 ? (
        <CustomTabPanel value={value} index={0}>
          empty
        </CustomTabPanel>
      ) : (
        Array.from({ length: num }, (_, index) => (
          <CustomTabPanel key={index} value={value} index={index}>
            {/* Render content for each schedule */}
            <div>
              <DragDropContext onDragEnd={handleDragDrop}>
                <div
                  style={{
                    height: "700px",
                    overflowY: "auto",
                    zIndex: "-9999",
                  }}
                >
                  <ScheduleView
                    name={
                      scheduleDataArray[index]
                        ? scheduleDataArray[index].ScheduleName
                        : "N/A"
                    }
                    id={
                      scheduleDataArray[index]
                        ? scheduleDataArray[index].scheduleid
                        : "233"
                    }
                    semesterBlocks={
                      scheduleDataArray[index]
                        ? scheduleDataArray[index].semesterBlockstemp
                        : { semesterBlocks }
                    }
                    setParentSemesterBlocks={null}
                    viewOnly={true}
                    completed={
                      scheduleDataArray[index]
                        ? scheduleDataArray[index].completedtemp
                        : { completed }
                    }
                    planned={
                      scheduleDataArray[index]
                        ? scheduleDataArray[index].plannedtemp
                        : { planned }
                    }
                    total={
                      scheduleDataArray[index]
                        ? scheduleDataArray[index].totaltemp
                        : { total }
                    }
                    scheduleList={scheduleList}
                    setscheduleList={setscheduleList}
                  />
                </div>
              </DragDropContext>
            </div>
          </CustomTabPanel>
        ))
      )}
    </Box>
  );
};

export default DisplayStudentSchedule;
