import React from "react";
import Card from "@mui/material/Card";
import Popup from 'reactjs-popup';
import "./CoursePopup/CoursePopup.css";
import CardContent from "@mui/material/CardContent";
import { Draggable } from "react-beautiful-dnd";

type DraggableCourseProps = {
  course: string;
  index: number;
};

const DraggableCourse: React.FC<DraggableCourseProps> = ({ course, index }) => {
  return (
    <Draggable
      draggableId={"" + index}
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
                  {' '}
                  COURSE DESCRIPTION HERE
                </div>
                <div className="sessionText">
                  <h3>Course Sessions:</h3>
                </div>

                <div className='sessionsScroll'>
                  <div style={{ width: "200px" }}>
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
