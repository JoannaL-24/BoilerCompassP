import React, { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import { Draggable } from "react-beautiful-dnd";
import "./DraggableCourse.css";
import "../CoursePopup/CoursePopup.css";
import { purdueApiUrl } from "models/purdueapi";
import { o } from "odata";

type Meeting = {
  instructors: Array<string>;
  building: string;
  room: number;
  daysOfWeek: string;
  startTime: string;

  // for example - PT50M
  // means period of time 50 minutes
  // https://stackoverflow.com/questions/51168022/what-does-pt-prefix-stand-for-in-duration
  duration: string;
};

type DraggableCourseProps = {
  index: number;
  id: string;
  course: string;
  description: string;
  credit: number;
  classId: string; // use this to query meetings info when opening popup
  meetings?: Array<Meeting>;
  viewOnly: boolean;
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

    const meetings: Array<Meeting> = entities[0].Sections[0].Meetings.map(
      (meeting) => ({
        instructors: meeting.Instructors.map((instructor) => instructor.Name),
        building: meeting.Room.Building.ShortCode,
        room: meeting.Room.Number,
        daysOfWeek: meeting.DaysOfWeek,
        startTime: meeting.StartTime,
        duration: meeting.Duration,
        classId: classId,
      })
    );

    return meetings;
  } catch (error) {
    console.error(error);
    return null;
  }
}

const DraggableCourse: React.FC<DraggableCourseProps> = ({
  index,
  id,
  course,
  description,
  credit,
  classId,
  meetings,
  viewOnly,
}) => {
  const [meetingState, setMeetings] = useState<Array<Meeting> | undefined>(
    meetings
  );

  useEffect(() => {
    setMeetings(meetings);
  }, [meetings, classId]);

  const handleButtonClick = async () => {
    console.log("meetingState: ", meetingState);
    if (!meetingState) {
      const fetchedMeetings = await queryMeetings(classId);
      setMeetings(fetchedMeetings);
      console.log("Meetings fetched and set: ", fetchedMeetings);
    }
  };

  return (
    <Draggable
      style={{ zIndex: 9999 }}
      key={id}
      draggableId={id}
      index={index}
      isDragDisabled={viewOnly}
    >
      {(provided) => (
        <div
          className="course"
          style={{ zIndex: 9999 }}
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
            {(close) => (
              <div className="popupModal" style={{ zIndex: 9999 }}>
                <button className="close" onClick={close}>
                  &times;
                </button>
                <div className="header" style={{ zIndex: 9999 }}>
                  {course}
                </div>
                <div className="content" style={{ zIndex: 9999 }}>
                  Course Description: <br />
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--textPrimary)",
                      zIndex: 9999,
                    }}
                  >
                    {description} <br />
                  </div>
                  <br />
                  Credit Hours: {credit}
                </div>
                <div className="sessionText" style={{ zIndex: 9999 }}>
                  <h3>Course Sessions:</h3>
                </div>
                <div className="sessionsList" style={{ zIndex: 9999 }}>
                  {meetingState ? (
                    <div style={{ overflowY: "scroll", height: "100px" }}>
                      {meetingState.map((meeting, index) => (
                        <div key={index}>
                          Instructor(s): {meeting.instructors.join(", ")}
                          <br />
                          Location: {meeting.building} Room {meeting.room}
                          <br />
                          Time: {meeting.daysOfWeek} at {meeting.startTime}
                          <br />
                          Duration: {meeting.duration}
                          <br />
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
