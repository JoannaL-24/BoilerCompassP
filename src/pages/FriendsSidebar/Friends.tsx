import React, { useEffect, useState } from "react";
import "./Friends.css";
import ScheduleView from "components/ScheduleView/ScheduleView";
import { getSatisfied } from "models/BoilerCompass";
import { CS } from "models/CS";
import FriendsList from "components/FriendsList/FriendsList";

const SCHEDULE_DATA = {
  id: "12345",
  name: "Friend Schedule",
  completed: 0,
  planned: 0,
  total: 1,
  start_term: new Date("2022-08-19T24:00:00.000Z"),
  end_term: new Date("2026-05-03T24:00:00.000Z"),
  semester_blocks: [
    {
      id: 0,
      year: 2022,
      term: "Fall",
      credit: 4,
      course_list: [
        // {
        // id: "24508954-e0bc-407f-a823-ff348a51ac99",
        // classId: "1842e869-5d34-410a-b3e5-3ca3de853edf",
        // course: "CS18000",
        // description: "something",
        // credit: 4,
        // meeting: null
        // },
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
  planned_courses: []
}

const Friends = (scheduleList, setSchedulesList) => {
  const [schedule, setSchedule] = useState(SCHEDULE_DATA);

  return (
    <>
      <ScheduleView
        id={schedule.id}
        name={schedule.name}
        semesterBlocks={schedule.semester_blocks}
        setParentSemesterBlocks={null}
        viewOnly={true}
        // completed={getSatisfied(CS, new Set(schedule.completed_courses))[0]}
        // planned={getSatisfied(CS, new Set(schedule.planned_courses))[0]}
        // total={getSatisfied(CS, new Set(schedule.completed_courses))[1]}
        completed={schedule.completed}
        planned={schedule.planned}
        total={schedule.total}
        scheduleList={scheduleList}
        setscheduleList={setSchedulesList}
        deleteSchedule={undefined}
      />
      {/* TODO: change classname to scheduleSide if applicable */}
      <div className="friendsSide">
        <div className="listWindow">
          <h3>Friends</h3>
          <FriendsList setFriendSchedule={setSchedule}></FriendsList>
        </div>
        <br /><br />
        <div className="listWindow">
          <h3>Requests</h3>
          {/* request list */}
        </div>
      </div>
    </>
  )
}

export default Friends