import React from 'react';
import { ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, Inject } from '@syncfusion/ej2-react-schedule';
import './SchedulePage.scss';

function SchedulePage() {
  const data = [
    {
      Id: 1,
      Subject: 'Meeting - 1',
      StartTime: new Date(2018, 1, 15, 10, 0),
      EndTime: new Date(2018, 1, 15, 10, 0),
      IsAllDay: true,
    }];
  return (
    <div className="schedule">
      <div><p className="heading">Time slots</p></div>
      <div><p className="text">Select the block of time slot, according to your availability</p></div>
      <div className="control-pane">
        <div className="control-section">
          <div className="calendar-control-section" style={{ overflow: 'auto' }}>
            <ScheduleComponent
              selectedDate={new Date(2018, 1, 15)}
              eventSettings={{ dataSource: data }}
              currentView="Month"
            >
              <Inject services={[Day, Week, WorkWeek, Month, Agenda]} />
            </ScheduleComponent>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SchedulePage;
