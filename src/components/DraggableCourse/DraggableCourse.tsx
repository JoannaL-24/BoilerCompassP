import React from "react";
import Popup from 'reactjs-popup';
import { Draggable } from "react-beautiful-dnd";
import "./DraggableCourse.css"
import "../CoursePopup/CoursePopup.css";

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
};

const DraggableCourse: React.FC<DraggableCourseProps> = ({ index, id, course, description, credit }) => {
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
          <Popup trigger={<button>{course}</button>}
            modal
            nested
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
                  <div style={{ overflowY: "scroll", height: "100px" }}>
                    1 <br />
                    2 <br />
                    3 <br />
                    4 <br />
                    5 <br />
                    6 <br />
                    7 <br />
                    8 <br />
                    9 <br />
                    10 <br />
                  </div>
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
