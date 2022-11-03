/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';
import moment from 'moment';
import { addClass } from '@syncfusion/ej2-base';
import Appointment from '../../components/Appointments/Appointments';
import './AppointmentsPage.scss';
import RequestToReschedule from '../../components/Notifications/RequestToReschedule';
import RescheduleAccept from '../../components/Notifications/RescheduleAccept';

export default function AppointmentsPage() {
  const { schedules } = useSelector((state) => state.schedules);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [pastSessions, setPastSessions] = useState([]);
  const [isUpcoming, setIsUpcoming] = useState(true);
  const [isPast, setIsPast] = useState(false);
  const [isMessages, setIsMessages] = useState(false);
  const [visibleDate, setVisibleDate] = useState(null);
  const [validDates, setValidDates] = useState([]);

  useEffect(() => {
    schedules.forEach((schedule) => {
      if (schedule.isBooked) {
        setValidDates((prevDates) => [...prevDates, new Date(schedule.startTime).toISOString()]);
      }
    });
  }, []);

  useEffect(() => {
    setUpcomingSessions([]);
    setPastSessions([]);
    schedules.forEach((schedule) => {
      if (schedule.startTime > (new Date()).toISOString()) {
        setUpcomingSessions((upcomingSessions) => [...upcomingSessions, schedule]);
      } else {
        setPastSessions((pastSessions) => [...pastSessions, schedule]);
      }
    });
  }, [schedules]);

  const openUpcoming = () => {
    setIsUpcoming(true);
    setIsPast(false);
    setIsMessages(false);
    document.getElementById('upcoming').classList.add('active');
    document.getElementById('past').classList.remove('active');
    document.getElementById('messages').classList.remove('active');
  };

  const openPast = () => {
    setIsUpcoming(false);
    setIsPast(true);
    setIsMessages(false);
    document.getElementById('upcoming').classList.remove('active');
    document.getElementById('past').classList.add('active');
    document.getElementById('messages').classList.remove('active');
  };

  const openMessages = () => {
    setIsUpcoming(false);
    setIsPast(false);
    setIsMessages(true);
    document.getElementById('upcoming').classList.remove('active');
    document.getElementById('past').classList.remove('active');
    document.getElementById('messages').classList.add('active');
  };

  const onDateChanged = (event) => {
    setVisibleDate(event.value);
  };

  const specialDate = (args) => {
    addClass([args.element], ['e-day', 'special']);
    args.element.style.backgroundColor = 'rgba(170, 102, 204, 0.5)';
    args.element.style.borderRadius = '100%';
  };

  const disabledDate = async (args) => {
    args.isDisabled = true;
    validDates.forEach((d) => {
      if (moment(d).local().format('MMM DD YYYY') === moment(new Date(args.date).toISOString()).local().format('MMM DD YYYY')) {
        args.isDisabled = false;
        if (Date.parse(new Date(d)) >= Date.parse(new Date())) {
          specialDate(args);
        }
      }
    });
  };

  return (
    <div className="AllAppointments" id="dialog-target">
      <div style={{ width: '100%' }}>
        <h1>Appointments</h1>
        <div className="appointments__navbar">
          <div className="appointments__links">
            <span id="upcoming" className="active" onClick={openUpcoming} role="button">Upcoming</span>
            <span id="past" onClick={openPast} role="button">Past</span>
            <span id="messages" onClick={openMessages} role="button">Messages</span>
          </div>
          <DatePickerComponent
            format="dd MMMM"
            id="startTime"
            data-name="startTime"
            value={visibleDate}
            className="e-field"
            change={onDateChanged}
            renderDayCell={disabledDate}
          />
        </div>
      </div>
      <div className="Appointments">
        {isUpcoming && visibleDate && (
          <div>
            {upcomingSessions.filter((item) => {
              const date = moment(item.startTime.toString()).local().format('MMM DD YYYY');
              const currD = moment(visibleDate.toString()).local().format('MMM DD YYYY');
              return (date === currD);
            }).map((schedule, i) => {
              if (schedule.isBooked) {
                return <Appointment key={i} schedule={schedule} status="upcoming" visibleDate={visibleDate} />;
              }
              return null;
            })}
          </div>
        )}
        {isUpcoming && visibleDate === null && (
          <div>
            {upcomingSessions.map((schedule, i) => {
              if (schedule.isBooked) {
                return <Appointment key={i} schedule={schedule} status="upcoming" visibleDate={visibleDate} />;
              }
              return null;
            })}
          </div>
        )}
        {isPast && visibleDate && (
          <div>
            {pastSessions.filter((item) => {
              const date = moment(item.startTime.toString()).local().format('MMM DD YYYY');
              const currD = moment(visibleDate.toString()).local().format('MMM DD YYYY');
              return (date === currD);
            }).map((schedule, i) => {
              if (schedule.isBooked) {
                return <Appointment key={i} schedule={schedule} status="past" visibleDate={visibleDate} />;
              }
              return null;
            })}
          </div>
        )}
        {isPast && visibleDate === null && (
          <div>
            {pastSessions.map((schedule, i) => {
              if (schedule.isBooked) {
                return <Appointment key={i} schedule={schedule} status="past" visibleDate={visibleDate} />;
              }
              return null;
            })}
          </div>
        )}
        {isMessages && (
          <div>
            {upcomingSessions.map((schedule, i) => {
              if (schedule.isBooked && schedule.rescheduledByClient) {
                return <RequestToReschedule key={i} schedule={schedule} />;
              }
              if (schedule.isBooked && schedule.rescheduledByMhp) {
                return <RescheduleAccept key={i} schedule={schedule} />;
              }
              return null;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
