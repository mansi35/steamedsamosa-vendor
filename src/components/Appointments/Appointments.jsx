import React, { useState } from 'react';
import moment from 'moment';
import { Avatar, Box, CircularProgress } from '@mui/material';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import './Appointments.scss';
import { useDispatch } from 'react-redux';
import { cancelRequestReschedule, requestReschedule } from '../../actions/schedule';

export default function Appointment({ schedule, status, visibleDate }) {
  const user = JSON.parse(localStorage.getItem('profile'))?.user;
  let urlName = user.displayName.trim().toLowerCase().replace(/[\W_]+/g, '-') + '-';
  urlName += user.id;
  const [visibility, setDialogVisibility] = useState(false);
  const [loading, setLoading] = useState({ display: 'none' });
  const dispatch = useDispatch();
  const gapi = window.gapi;
  const CLIENT_ID = process.env.REACT_APP_CALENDAR_CLIENT_ID;
  const API_KEY = process.env.REACT_APP_CALENDAR_API_KEY;
  const DISCOVERY_DOCS = [
    'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
  ];
  const SCOPES = 'https://www.googleapis.com/auth/calendar.events';

  const addToCalendar = () => {
    gapi.load('client:auth2', () => {
      console.log('loaded client');
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      });

      gapi.client.load('calendar', 'v3', () => console.log('bam!'));

      gapi.auth2
        .getAuthInstance()
        .signIn()
        .then(() => {
          const calendarEvent = {
            summary: `Raahee: ${schedule.user.displayName}'s appointment with ${user.displayName}`,
            location: 'Online',
            description: `$Join the meeting through this link: ${user.meetUrl ? user.meetUrl : ''}`,
            start: {
              dateTime: `${new Date(schedule.startTime).toISOString()}`,
              timeZone: 'Asia/Kolkata',
            },
            end: {
              dateTime: `${new Date(schedule.endTime).toISOString()}`,
              timeZone: 'Asia/Kolkata',
            },
            attendees: [
              {
                email: `${schedule.user.email}`,
                organizer: true,
              },
            ],
            reminders: {
              useDefault: false,
              overrides: [
                { method: 'email', minutes: 24 * 60 },
                { method: 'popup', minutes: 30 },
                { method: 'popup', minutes: 10 },
              ],
            },
            sendUpdates: 'all',
          };

          const request = gapi.client.calendar.events.insert({
            calendarId: 'primary',
            resource: calendarEvent,
          });

          request.execute((event) => {
            window.open(event.htmlLink, '_blank');
          });
        });
    });
  };

  const sendRescheduleRequest = (scheduleId) => {
    setLoading({ display: 'inline' });
    dispatch(requestReschedule(scheduleId))
      .then(() => {
        setLoading({ display: 'none' });
        setDialogVisibility(false);
      });
  };

  const cancelRescheduleRequest = (scheduleId) => {
    setLoading({ display: 'inline' });
    dispatch(cancelRequestReschedule(scheduleId))
      .then(() => {
        setLoading({ display: 'none' });
        setDialogVisibility(false);
      });
  };

  const rescheduleFooter = () => {
    return (
      <button
        type="button"
        className="e-control e-btn e-lib rescheduleModal__button e-primary e-flat"
        onClick={() => {
          if (!schedule.rescheduleRequested) {
            sendRescheduleRequest(schedule.id);
          } else {
            cancelRescheduleRequest(schedule.id);
          }
        }}
      >
        {schedule.rescheduleRequested ? 'Cancel Reschedule Request' : 'Request to Reschedule'}
        <Box sx={loading}>
          <CircularProgress style={{ color: '#FFFFFF' }} />
        </Box>
      </button>
    );
  };

  const handleClick = () => {
    // navigate('/schedule');
    setDialogVisibility(true);
  };

  const dialogClose = () => {
    setDialogVisibility(false);
  };

  return (
    <div className="appointment">
      <div className="appointmentBar">
        <div className="timings">
          {!visibleDate && <h6>{moment(schedule.startTime.toString()).local().format('MMM DD YYYY')}</h6>}
          <h2>
            {moment(schedule.startTime.toString()).local().format('h:mm')}
            -
            {moment(schedule.endTime.toString()).local().format('h:mm A')}
          </h2>
          {status === 'upcoming' && !schedule.rescheduleRequested && (
            <p onClick={() => handleClick()}>Reschedule</p>
          )}
          {status === 'upcoming' && schedule.rescheduleRequested && (
            <p onClick={() => handleClick()} style={{ textDecoration: 'none', fontWeight: 300 }}>Reschedule Requested</p>
          )}
        </div>
        <div className="clientDetails">
          <Avatar src={schedule.user.image ? schedule.user.image.url : ''} alt="client profile photo" />
          <h2>{schedule.user.displayName}</h2>
        </div>
        <div className="join">
          {status === 'upcoming' ? (
            <button>
              <a href={user.meetUrl ? user.meetUrl : 'https://meet.google.com'}>Join Meet</a>
            </button>
          ) : (
            <button>
              <a href={`https://raahee.in/therapists/${urlName}`} target="_blank" rel="noreferrer">Reviews</a>
            </button>
          )}
          {status === 'upcoming' && !schedule.rescheduleRequested && (
            <button className="addToCalendar" onClick={() => addToCalendar()}>
              <InsertInvitationIcon />
            </button>
          )}
        </div>
      </div>
      <DialogComponent
        width="400px"
        target="#dialog-target"
        isModal
        animationSettings={{ effect: 'Zoom', duration: 400, delay: 0 }}
        close={() => dialogClose()}
        header=""
        visible={visibility}
        showCloseIcon
        footerTemplate={rescheduleFooter}
        className="reschedule__modal"
      >
        <div className="modal__clientProfile">
          <img src={schedule.user.image ? schedule.user.image.url : ''} alt="client profile pic" />
          <h2>{schedule.user.displayName}</h2>
        </div>
        <div className="modal__clientSchedule">
          <AccessTimeIcon />
          <h4>{moment(schedule.startTime.toString()).utc().format('MMMM DD, YYYY')}</h4>
          <div className="modal__clientTime">
            <h5>{moment(schedule.startTime.toString()).format('h:mma')}</h5>
            <div className="modal__timeBar" />
            <h5>{moment(schedule.endTime.toString()).format('h:mma')}</h5>
          </div>
        </div>
      </DialogComponent>
    </div>
  );
}
