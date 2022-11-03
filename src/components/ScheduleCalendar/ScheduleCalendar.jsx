/* eslint-disable no-param-reassign */
import React, { useRef } from 'react';
import { ScheduleComponent, Day, Week, DragAndDrop, Inject, ViewsDirective, ViewDirective, RecurrenceEditorComponent } from '@syncfusion/ej2-react-schedule';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { L10n } from '@syncfusion/ej2-base';
import { DateTimePickerComponent } from '@syncfusion/ej2-react-calendars';
import moment from 'moment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useDispatch, useSelector } from 'react-redux';
import { cancelRequestReschedule, createSchedule, deleteMhpSchedule, requestReschedule, updateSchedule } from '../../actions/schedule';
import avatar from '../../assets/avatar-placeholder.png';
import './ScheduleCalendar.scss';

L10n.load({
  'en-US': {
    schedule: {
      saveButton: 'Save',
      cancelButton: 'Cancel',
      deleteButton: 'Remove',
      newEvent: 'Add Time Slot',
      editEvent: 'Update Time Slot',
      deleteEvent: 'Delete Time Slot',
    },
  },
});

function ScheduleCalendar() {
  const scheduleObj = useRef();
  const recurrenceObj = useRef();
  const { schedules } = useSelector((state) => state.schedules);
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem('profile'))?.user;

  const onActionBegin = (args) => {
    if (args.requestType === 'eventCreate') {
      console.log(args.data);
      args.cancel = true;
      if (scheduleObj.current.isSlotAvailable(args.data[0].startTime, args.data[0].endTime)) {
        dispatch(createSchedule({
          startTime: args.data[0].startTime.toISOString(),
          endTime: args.data[0].endTime.toISOString(),
          sessionType: args.data[0].sessionType,
          RecurrenceRule: args.data[0].RecurrenceRule,
          RecurrenceID: args.data[0].RecurrenceID,
          RecurrenceException: args.data[0].RecurrenceException,
        }));
      }
    } else if (args.requestType === 'eventChange') {
      console.log(args);
      if (args.data.isBooked) {
        args.cancel = true;
      } else if (scheduleObj.current.isSlotAvailable(args.data.startTime, args.data.endTime)) {
        dispatch(updateSchedule(args.data.id, {
          startTime: args.data.startTime.toISOString(),
          endTime: args.data.endTime.toISOString(),
          sessionType: args.data.sessionType,
          RecurrenceRule: args.data.RecurrenceRule,
          RecurrenceID: args.data.RecurrenceID,
          RecurrenceException: args.data.RecurrenceException,
        }));
      } else {
        args.cancel = true;
      }
    } else if (args.requestType === 'eventRemove') {
      if (args.data.isBooked) {
        args.cancel = true;
      } else {
        dispatch(deleteMhpSchedule(args.data[0].id));
      }
    }
  };

  const eventTemplate = (props) => {
    if (props.sessionType === 'Therapy Session') {
      if (props.isBooked) {
        return (
          <div>
            <div className="schedulePage__schedulerEvent" style={{ background: '#AB70CA' }} role="button">
              <div>
                {props.rescheduleRequested ? (
                  <div>
                    Reschedule
                    <br />
                    Requested
                  </div>
                ) : 'Booked'}
              </div>
            </div>
          </div>
        );
      }
      return (
        <div className="schedulePage__schedulerEvent" style={{ background: '#AB70CA' }} />
      );
    }

    if (props.isBooked) {
      return (
        <div>
          <div className="schedulePage__schedulerEvent" style={{ background: '#FA8A8A' }} role="button">
            <div>Booked</div>
          </div>
        </div>
      );
    }
    return (
      <div className="schedulePage__schedulerEvent" style={{ background: '#FA8A8A' }} />
    );
  };

  const onSessionTypeChange = (args) => {
    if (args.itemData !== null) {
      const startObj = document.querySelector('#startTime').ej2_instances[0];
      const endObj = document.querySelector('#endTime').ej2_instances[0];
      if (args.itemData.value === 'Consultation Call') {
        endObj.value = new Date(startObj.value.getTime() + 15 * 60000);
      } else {
        endObj.value = new Date(startObj.value.getTime() + user.sessionDuration * 60000);
      }
    }
  };

  const onStartTimeChange = (args) => {
    const sessionObj = document.querySelector('#sessionType').ej2_instances[0];
    const endObj = document.querySelector('#endTime').ej2_instances[0];
    if (sessionObj.value === 'Consultation Call') {
      endObj.value = new Date(args.value.getTime() + 15 * 60000);
    } else {
      endObj.value = new Date(args.value.getTime() + user.sessionDuration * 60000);
    }
  };

  const editorTemplate = (props) => {
    if (props !== undefined && !props.isBooked) {
      return (
        <table className="custom-event-editor" style={{ width: '100%', cellpadding: '5' }}>
          <tbody>
            <tr>
              <td className="e-textlabel">Session Type</td>
              <td className="custom-dropdown" colSpan={4}>
                <DropDownListComponent
                  id="sessionType"
                  placeholder="Session Type"
                  data-name="sessionType"
                  className="e-field"
                  style={{ width: '100%' }}
                  dataSource={[
                    { text: 'Therapy Session', value: 'Therapy Session' },
                    { text: 'Consultation Call', value: 'Consultation Call' },
                  ]}
                  fields={{ text: 'text', value: 'value' }}
                  value={props.sessionType || 'null'}
                  change={onSessionTypeChange}
                />
              </td>
            </tr>
            <tr>
              <td className="e-textlabel">Start Time</td>
              <td colSpan={4}>
                <DateTimePickerComponent
                  format="dd/MM/yy hh:mm a"
                  step={user.sessionDuration}
                  id="startTime"
                  data-name="startTime"
                  value={new Date(props.startTime || props.StartTime)}
                  className="e-field"
                  change={onStartTimeChange}
                />
              </td>
            </tr>
            <tr>
              <td className="e-textlabel">End Time</td>
              <td colSpan={4}>
                <DateTimePickerComponent
                  format="dd/MM/yy hh:mm a"
                  step={user.sessionDuration}
                  id="endTime"
                  data-name="endTime"
                  value={new Date(props.endTime || props.EndTime)}
                  className="e-field"
                />
              </td>
            </tr>
            <tr>
              <td className="e-textlabel">Recurrence</td>
              <td colSpan={4}>
                <RecurrenceEditorComponent ref={recurrenceObj} id="RecurrenceEditor" />
              </td>

            </tr>
          </tbody>
        </table>
      );
    }
    if (props !== undefined && props.isBooked) {
      return (
        <div className="reschedule__modal">
          <div className="modal__clientProfile">
            <img src={props.user.image ? props.user.image.url : avatar} alt="client profile pic" />
            <h2>{props.user.displayName}</h2>
          </div>
          <div className="modal__clientSchedule">
            <AccessTimeIcon />
            <h4>{moment(props.startTime.toString()).utc().format('MMMM DD, YYYY')}</h4>
            <div className="modal__clientTime">
              <h5>{moment(props.startTime.toString()).format('h:mma')}</h5>
              <div className="modal__timeBar" />
              <h5>{moment(props.endTime.toString()).format('h:mma')}</h5>
            </div>
          </div>
          <button className="btn e-control e-btn e-lib custom rescheduleModal__button e-primary e-flat" id="button2" onClick={props.rescheduleRequested ? () => cancelRescheduleRequest(props.id) : () => sendRescheduleRequest(props.id)}>
            {props.rescheduleRequested ? <>Cancel Reschedule Request</> : <>Request to Reschedule</>}
          </button>
        </div>
      );
    }
    return (<div />);
  };

  const sendRescheduleRequest = (scheduleId) => {
    dispatch(requestReschedule(scheduleId));
    document.querySelector('.e-schedule').ej2_instances[0].closeEditor();
  };

  const cancelRescheduleRequest = (scheduleId) => {
    dispatch(cancelRequestReschedule(scheduleId));
    document.querySelector('.e-schedule').ej2_instances[0].closeEditor();
  };

  const onPopupOpen = (args) => {
    try {
      if (args.element.classList.contains('booked')) {
        args.element.classList.remove('booked');
      }
      if (args.element.classList.contains('not-booked')) {
        args.element.classList.remove('not-booked');
      }
      if (args.type === 'Editor') {
        if (!args.data.isBooked) {
          args.element.classList.add('not-booked');
          scheduleObj.current.eventWindow.recurrenceEditor = recurrenceObj.current;
          recurrenceObj.current.setRecurrenceRule(args.data.RecurrenceRule);
          const statusElement = args.element.querySelector('#sessionType');
          statusElement.setAttribute('name', 'sessionType');
          const sessionObj = document.querySelector('#sessionType').ej2_instances[0];
          sessionObj.value = args.data.sessionType ? args.data.sessionType : 'Therapy Session';
          const endObj = document.querySelector('#endTime').ej2_instances[0];
          endObj.value = args.data.endTime ? args.data.endTime : new Date(endObj.value.getTime() + (user.sessionDuration - 30) * 60000);
          if (args.element.querySelector('.e-footer-content')) {
            args.element.querySelector('.e-footer-content').style.display = '';
          }
        } else if (args.data.isBooked) {
          args.element.classList.add('booked');
          if (args.element.querySelector('.e-footer-content')) {
            args.element.querySelector('.e-footer-content').style.display = 'none';
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onCellClick = (args) => {
    scheduleObj.current.openEditor(args, 'Add');
  };

  const onEventClick = (args) => {
    if (!args.event.RecurrenceRule) {
      scheduleObj.current.openEditor(args.event, 'Save');
    } else {
      scheduleObj.current.quickPopup.openRecurrenceAlert();
    }
  };

  return (
    <ScheduleComponent
      ref={scheduleObj}
      showQuickInfo={false}
      eventClick={onEventClick}
      cellClick={onCellClick}
      eventSettings={{
        dataSource: schedules,
        template: eventTemplate,
        fields: {
          id: 'id',
          isBooked: 'isBooked',
          sessionType: { name: 'sessionType', validation: { required: true } },
          startTime: { name: 'startTime', validation: { required: true } },
          endTime: { name: 'endTime', validation: { required: true } },
          RecurrenceRule: 'RecurrenceRule',
          RecurrenceID: 'RecurrenceID',
          RecurrenceException: 'RecurrenceException',
        },
      }}
      popupOpen={onPopupOpen}
      actionBegin={onActionBegin}
      editorTemplate={editorTemplate}
      className="schedulePage__scheduler"
      width="100%"
      height="75vh"
      selectedDate={new Date()}
      enablePersistence
    >
      <ViewsDirective>
        <ViewDirective option="Week" />
        <ViewDirective option="Day" />
      </ViewsDirective>
      <Inject services={[Day, Week, DragAndDrop]} />
    </ScheduleComponent>
  );
}

export default ScheduleCalendar;
