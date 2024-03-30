import React, { useState } from "react";
import Popup from 'reactjs-popup';
import { Draggable } from "react-beautiful-dnd";
import "./DraggableCourse.css"
import "../CoursePopup/CoursePopup.css";
import { purdueApiUrl } from "models/purdueapi";
import { o } from 'odata';

type Meeting = {
  instructors: Array<string>,
  building: string,
  room: number,
  daysOfWeek: string,
  startTime: string,

  // for example - PT50M
  // means period of time 50 minutes
  // https://stackoverflow.com/questions/51168022/what-does-pt-prefix-stand-for-in-duration
  duration: string,
}

type DraggableCourseProps = {
  index: number;
  id: string;
  course: string;
  description: string;
  credit: number;
  classId: string;  // use this to query meetings info when opening popup
  meetings?: Array<Meeting>;
};

async function queryMeetings(classId: string): Promise<Meeting[]> {
  const oHandler = o(purdueApiUrl);
  try {
    const entities = await oHandler.get("Classes").query({
      $top: 1,
      $expand: `Sections($filter=Type eq 'Lecture';$expand=Meetings($expand=Instructors,Room($expand=Building)))`,
      $filter: `id eq ${classId}`,
    });
    // console.log("Entities: ", entities);

    const meetings: Array<Meeting> = entities[0].Sections[0].Meetings.map(meeting => ({
      instructors: meeting.Instructors.map(instructor => instructor.Name),
      building: meeting.Room.Building.ShortCode,
      room: meeting.Room.Number,
      daysOfWeek: meeting.DaysOfWeek,
      startTime: meeting.StartTime,
      duration: meeting.Duration,
      classId: classId,
    }));

    return meetings;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

const DraggableCourse: React.FC<DraggableCourseProps> = (
  { index, id, course, description, credit, classId : initialClassId, meetings: initialMeetings }
) => {
  const [meetings, setMeetings] = useState<Array<Meeting> | undefined>(initialMeetings);
  const [classId, setClassId] = useState<string>(initialClassId);

  const handleButtonClick = async () => {
    if (meetings === undefined || initialClassId !== classId) {
      if (initialClassId !== classId) {
        setMeetings(undefined);
      }
      const fetchedMeetings = await queryMeetings(initialClassId);
      setMeetings(fetchedMeetings);
      setClassId(classId);
      console.log("Meetings: ", fetchedMeetings);
    }
  };

  return (
    <Draggable
      key={id}
      draggableId={id}
      index={index}
    >
      {(provided) => (
        <div
          className="course"
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          <Popup
            trigger={<button>{course}</button>}
            modal
            nested
            onOpen={handleButtonClick}
          >
            {close => (
              <div className='popupModal'>
                <button className='close' onClick={close}>
                  &times;
                </button>
                <div className='header'>{course}</div>
                <div className='content'>
                  Course Description: <br />
                  <div style={{ fontSize: 12, color: 'var(--textPrimary)' }}>
                    {description} <br />
                  </div>

                  <br />
                  Credit Hours: {credit}
                </div>
                <div className="sessionText">
                  <h3>Course Sessions:</h3>
                </div>
                <div className='sessionsList'>
                  {meetings ? (
                    <div style={{ overflowY: "scroll", height: "100px" }}>
                      {meetings.map((meeting, index) => (
                        <div key={index}>
                          Instructor(s): {meeting.instructors.join(", ")}<br />
                          Location: {meeting.building} Room {meeting.room}<br />
                          Time: {meeting.daysOfWeek} at {meeting.startTime}<br />
                          Duration: {meeting.duration}<br />
                          <br />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>No meeting information available.</div>
                  )}

                </div>

              </div>
            )}
          </Popup>
        </div>
      )}
    </Draggable>
  );
};

export default DraggableCourse;
