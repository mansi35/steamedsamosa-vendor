import React from 'react';
import './SchedulePage.scss';
import ScheduleCalendar from '../../components/ScheduleCalendar/ScheduleCalendar';
import ScheduleHeader from '../../components/ScheduleHeader/ScheduleHeader';

function SchedulePage() {
  return (
    <div className="schedulePage" id="dialog-target-schedule">
      <div className="schedulePage__content">
        <ScheduleHeader />
        <ScheduleCalendar />
      </div>
    </div>
  );
}

export default SchedulePage;
