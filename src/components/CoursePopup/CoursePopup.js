import React from 'react';
import Popup from 'reactjs-popup';
import "./CoursePopup.css";
import DraggableCourse from '../DraggableCourse';

const CoursePopup = () => {
  return (
    <div>
      <Popup trigger = {<button>COURSE</button>}
        modal
        nested
      >
        {close => (
          <div className='modal'>
            <button className='close' onClick = {close}>
              &times;
            </button>
            <div className='header'>COURSE NAME</div>
            <div className='content'>
              {' '}
              COURSE DESCRIPTION HERE
            </div>
            <h3>Course Sessions:</h3>
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
  )
};

export default CoursePopup
