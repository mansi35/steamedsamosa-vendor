import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { CalendarComponent } from '@syncfusion/ej2-react-calendars';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { Box, CircularProgress } from '@mui/material';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import './WorkExpDialog.scss';
import { createWorkExp, deleteWorkExp, updateWorkExp } from '../../actions/workExps';

function WorkExpDialog(props) {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem('profile'))?.user;
  const maxStartDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
  const [loading, setLoading] = useState({ display: 'none' });
  const [deleteLoading, setDeleteLoading] = useState({ display: 'none' });
  const [minEndDate, setMinEndDate] = useState(new Date());
  const [startDateTime, setStartDateTime] = useState(new Date());
  const [endDateTime, setEndDateTime] = useState(null);
  const [formData, setFormData] = useState({
    title: props.exp.organization,
    employment: props.exp.empType,
    isCheck: props.exp.isCurrentlyWorking,
    start: props.exp.startDateTime ? moment(props.exp.startDateTime.toString()).local().format('MMM YYYY') : '',
    end: props.exp.endDateTime ? moment(props.exp.endDateTime.toString()).local().format('MMM YYYY') : '',
    workDesc: props.exp.workDescription,
  });

  const [visibility, setVisibility] = useState({
    startDate: false,
    endDate: false,
  });

  // ===========================STATE FUNCTIONS==========================

  function handleFormData(event) {
    const { name, value } = event.target;
    if (name === 'checkbox') {
      setFormData((prev) => {
        return {
          ...prev,
          isCheck: !prev.isCheck,
          end: '',
        };
      });
    } else {
      setFormData((prev) => {
        return {
          ...prev,
          [name]: value,
        };
      });
    }
  }

  const onEndDateChange = (e) => {
    const date = new Date(e.value);
    const formattedDate = moment(date.toString()).local().format('MMM YYYY');
    setEndDateTime(new Date(date.getFullYear(), date.getMonth(), 1));
    setFormData((prev) => {
      return {
        ...prev,
        end: formattedDate,
      };
    });
    setVisibility((prev) => {
      return {
        ...prev,
        endDate: !prev.endDate,
      };
    });
  };

  const onStartDateChange = (e) => {
    const date = new Date(e.value);
    const EndDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    setMinEndDate(EndDate);
    const formattedDate = moment(date.toString()).local().format('MMM YYYY');
    setStartDateTime(new Date(date.getFullYear(), date.getMonth(), 1));
    console.log(date, formattedDate, date.toISOString());
    setFormData((prev) => {
      return {
        ...prev,
        start: formattedDate,
        end: '',
      };
    });
    setVisibility((prev) => {
      return {
        ...prev,
        startDate: !prev.startDate,
      };
    });
  };

  // ===========================STATE FUNCTIONS END==========================

  function handleSubmit(e) {
    e.preventDefault();
    setLoading({ display: 'inline' });
    if (props.exp.id === '') {
      dispatch(createWorkExp({
        organization: formData.title,
        empType: formData.employment,
        isCurrentlyWorking: formData.isCheck,
        startDateTime: startDateTime,
        endDateTime: endDateTime,
        workDescription: formData.workDesc,
        mhp: user.id,
      })).then(() => {
        setLoading({ display: 'none' });
        props.handleDialogVisibility();
      });
    } else {
      dispatch(updateWorkExp(props.exp.id, {
        organization: formData.title,
        empType: formData.employment,
        isCurrentlyWorking: formData.isCheck,
        startDateTime: startDateTime,
        endDateTime: endDateTime,
        workDescription: formData.workDesc,
      })).then(() => {
        setLoading({ display: 'none' });
        props.handleDialogVisibility();
      });
    }
  }

  function handleDelete(e) {
    e.preventDefault();
    setDeleteLoading({ display: 'inline' });
    dispatch(deleteWorkExp(props.exp.id))
      .then(() => {
        setDeleteLoading({ display: 'none' });
        props.handleDialogVisibility();
      });
  }

  return (
    <DialogComponent
      width="500px"
      target="#dialog-target-workEx"
      isModal
      animationSettings={{ effect: 'Zoom', duration: 400, delay: 0 }}
      close={() => props.handleDialogVisibility()}
      header="* indicates required field"
      visible={visibility}
      showCloseIcon
      className="work-exp-form-div"
    >
      <form autoComplete="off" onSubmit={(e) => handleSubmit(e)}>
        <div className="input-div">
          <label htmlFor="title">Title(Organisation name)*</label>
          <br />
          <input className="input-box" type="text" id="title" name="title" value={formData.title} onChange={handleFormData} required />
        </div>
        <div className="input-div">
          <label htmlFor="employment">Employment type*</label>
          <br />
          <input className="input-box" type="text" id="employment" name="employment" value={formData.employment} onChange={handleFormData} required />
        </div>
        <div className="input-div checkbox-div">
          <input type="checkbox" name="checkbox" checked={formData.isCheck} onChange={handleFormData} />
          <label>I am currently working in this role</label>
        </div>
        <div className="input-div">
          <label>Start Date*</label>
          <div className="date-div">
            <input className="input-box" value={formData.start} readOnly required />
            <DateRangeIcon
              onClick={() => {
                setVisibility((prev) => {
                  return {
                    ...prev,
                    startDate: !prev.startDate,
                  };
                });
              }}
              className="picker-icon"
            />
            {visibility.startDate && <CalendarComponent start="Year" depth="Year" className="month-year-picker" change={onStartDateChange} max={maxStartDate} />}
          </div>
        </div>
        <div className={formData.start.length > 0 && !formData.isCheck ? 'input-div' : 'input-div disabled-div'}>
          <label>End Date*</label>
          <div className="date-div">
            <input className="input-box" value={formData.end} readOnly />
            <DateRangeIcon
              onClick={() => {
                setVisibility((prev) => {
                  return {
                    ...prev,
                    endDate: !prev.endDate,
                  };
                });
              }}
              className="picker-icon"
            />
            {visibility.endDate && <CalendarComponent start="Year" depth="Year" className="month-year-picker" change={onEndDateChange} min={minEndDate} />}
          </div>
        </div>
        <div className="input-div">
          <label htmlFor="workDesc">Description</label>
          <br />
          <textarea className="input-box" type="text" id="workDesc" name="workDesc" value={formData.workDesc} onChange={handleFormData} />
        </div>
        <div className="btn-div">
          <button type="submit">
            Save
            <Box sx={loading}>
              <CircularProgress style={{ color: '#FFFFFF' }} />
            </Box>
          </button>
          {props.exp.id !== ''
            && (
              <button onClick={(e) => handleDelete(e)}>
                Delete
                <Box sx={deleteLoading}>
                  <CircularProgress style={{ color: '#FFFFFF' }} />
                </Box>
              </button>
            )}
        </div>
      </form>
    </DialogComponent>
  );
}

export default WorkExpDialog;
