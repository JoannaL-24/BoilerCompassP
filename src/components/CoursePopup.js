import React from 'react';
import Popup from 'reactjs-popup';
import "./CoursePopup.css";

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
            <div className='actions'>
              <Popup
                trigger = {<button className='button'>View Sessions</button>}
                nested
              >
                <span className='sessions'>
                  COURSE SESSIONS HERE
                </span>
              </Popup>
            </div>
          </div>
        )}
      </Popup>
    </div>
  )
}

export default CoursePopup
