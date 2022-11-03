import { Avatar } from '@mui/material';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import './RescheduleAccept.scss';

export default function RescheduleAccept({ schedule }) {
  const navigate = useNavigate();
  return (
    <div className="rescheduleAccept">
      <div className="content">
        <div className="content__info">
          <div className="photo one">
            <Avatar src={schedule.user.image ? schedule.user.image.url : ''} className="profile_image" alt="KM" />
          </div>
          <div className="two">
            <div className="name">{schedule.user.displayName}</div>
            <div className="request">
              Request to reschedule session is accepted. New schedule is:
            </div>
            <div className="time">
              {moment(schedule.startTime.toString()).local().format('MMM DD YYYY')}
              ,
              {' '}
              {moment(schedule.startTime.toString()).local().format('h:mm')}
              {' '}
              -
              {' '}
              {moment(schedule.endTime.toString()).local().format('h:mm')}
              .
            </div>
          </div>
        </div>
        <div className="photo three">
          <button className="view" onClick={() => navigate('/schedule')}>
            View
          </button>
        </div>
      </div>
    </div>
  );
}
