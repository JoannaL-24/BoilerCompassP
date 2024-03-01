import React from "react";
import Draggable from "react-draggable";
import Card from "@mui/material/Card";
import Popup from 'reactjs-popup';
import "./CoursePopup/CoursePopup.css";
import CardContent from "@mui/material/CardContent";

type DraggableCourseProps = {
  course: string;
};

const DraggableCourse: React.FC<DraggableCourseProps> = ({ course }) => {
  return (
    <Draggable>
      <Card
        style={{
          width: "150px",
          height: "100px",
        }}
      >

      <div>
      <Popup trigger = {<button>{course}</button>}
        modal
        nested
      >
        {close => (
          <div className='popupModal'>
            <button className='close' onClick = {close}>
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
              <div style = {{ width: "200px"}}>
                1 <br/>
                2 <br/>
                3 <br/>
                4 <br/>
                5 <br/>
                6 <br/>
                7 <br/>
                8 <br/>
                9 <br/>
                10 <br/>
              </div>
            </div>
          </div>
        )}
      </Popup>
    </div>
      </Card>
    </Draggable>
  );
};

export default DraggableCourse;
