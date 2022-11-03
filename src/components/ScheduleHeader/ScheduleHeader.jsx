import React, { useState } from 'react';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { IconButton } from '@material-ui/core';
import './ScheduleHeader.scss';

function ScheduleHeader() {
  const user = JSON.parse(localStorage.getItem('profile'))?.user;
  const [display, setDisplay] = useState({ display: 'none' });
  const [isVisible, setIsVisible] = useState(false);

  const switchInfoVisibility = () => {
    if (!isVisible) {
      setIsVisible(true);
      setDisplay({ display: 'flex' });
    } else {
      setIsVisible(false);
      setDisplay({ display: 'none' });
    }
  };

  return (
    <div className="scheduleHeader">
      <h1>Time Slots</h1>
      <div className="schedulePage__description">
        <h4>Select the block of time slot, according to your availability</h4>
        <IconButton onClick={switchInfoVisibility}>
          <InfoOutlinedIcon />
        </IconButton>
        <div className="schedulePage__info" style={display}>
          <div>
            <div className="regular__schedule" />
            <p>
              {user.sessionDuration}
              {' '}
              min Therapy Session
            </p>
          </div>
          <div>
            <div className="booked__schedule">
              <div />
            </div>
            <p>Booked Therapy Session</p>
          </div>
          <div>
            <div className="consultation__schedule" />
            <p>15 min Session</p>
          </div>
          <div>
            <div className="booked__schedule consultation__schedule">
              <div />
            </div>
            <p>15 min Booked Session</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScheduleHeader;
