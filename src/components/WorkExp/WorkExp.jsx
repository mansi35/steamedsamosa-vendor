import React from 'react';
import CircleIcon from '@mui/icons-material/Circle';
import './WorkExp.scss';
import moment from 'moment';

function WorkExp(props) {
  function editWorkExp() {
    props.editWorkExp(props.experience);
  }

  return (
    <div>
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div className="step" onClick={editWorkExp}>
        <CircleIcon style={{ color: '#AB70CA', fontSize: '30px' }} />
        <p>{props.experience.organization}</p>
      </div>
      <div className="empTypP">
        {props.experience.empType}
        <br />
        <div className="empduration">
          {moment(props.experience.startDateTime.toString()).local().format('MMM YYYY')}
          {' - '}
          {props.experience.endDateTime ? moment(props.experience.endDateTime.toString()).local().format('MMM YYYY') : 'present'}
        </div>
        {props.experience.workDescription}
      </div>
      <div className="step__verticalLine" style={{ backgroundColor: '#AB70CA' }} />
    </div>
  );
}

export default WorkExp;
