/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-scroll';
import { useNavigate } from 'react-router-dom';
import { withSnackbar } from 'notistack';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';
import { ReactComponent as DegreesIcon } from '../../assets/degrees-icon.svg';
import { ReactComponent as LanguagesIcon } from '../../assets/languages-icon.svg';
import { ReactComponent as SpecializationsIcon } from '../../assets/specializations-icon.svg';
import avatar from '../../assets/avatar-placeholder.png';
import WorkExpDialog from '../../components/WorkExpDialog/WorkExpDialog';
import './OverviewPage.scss';
import { LOGOUT } from '../../constants/actionTypes';
import WorkExp from '../../components/WorkExp/WorkExp';
// import { SendTimeExtensionSharp } from '@mui/icons-material';
// import { setUseProxies } from 'immer';

function Overview({ enqueueSnackbar }) {
  const expObject = {
    id: '',
    organization: '',
    empType: '',
    isCurrentlyWorking: false,
    startDateTime: '',
    endDateTime: '',
    workDescription: '',
  };
  const date = new Date();
  // const user = JSON.parse(localStorage.getItem('profile')).user;
  // const firstName = user.displayName?.split(' ')[0];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profile = JSON.parse(localStorage.getItem('profile'));
  const { schedules } = useSelector((state) => state.schedules);
  const { workExp } = useSelector((state) => state.workExp);
  const [currExperience, setCurrExperience] = useState(expObject);
  const [visibilityDialog, setVisibilityDialog] = useState(false);
  const [visibleDate, setVisibleDate] = useState(date);
  const [visibleSlots, setVisibleSlots] = useState({
    consultation: true,
    therapy: true,
  });

  const logout = () => {
    dispatch({ type: LOGOUT });
    navigate('/auth');
  };

  // useEffect(() => {
  //   if (profile.user.userType !== 'MHP') {
  //     enqueueSnackbar('You are not a MHP. Please head over to raahee.in', {
  //       variant: 'error',
  //     });
  //     logout();
  //   }
  // }, [profile]);

  function onDateChanged(event) {
    setVisibleDate(event.value);
  }

  function handleSlotsVisibility(e) {
    const { name } = e.target;
    if (name === 'therapy') {
      setVisibleSlots((prev) => {
        return { ...prev, [name]: !visibleSlots.therapy };
      });
    } else {
      setVisibleSlots((prev) => {
        return { ...prev, [name]: !visibleSlots.consultation };
      });
    }
  }

  function handleDialogVisibility() {
    setVisibilityDialog((prev) => !prev);
  }

  function editWorkExp(experience) {
    setCurrExperience({ ...experience });
    // console.log(experience);
    handleDialogVisibility();
  }

  return (
    <div className="overviewPage" id="dialog-target-workEx">
      <h1 className="overview__heading">Welcome Aditi ,</h1>
      <h2 className="overview__tagline">Monitor all your bookings here.</h2>
      <div className="overview__mhp">
        <div>
          <img
            src={avatar}
            alt="Test"
            className="image-size"
          />
        </div>
        <div className="overview__content">
          <div className="profile-name">Aditi Tiwari</div>
          <div className="designation">Event Manager</div>
          <div className="experience">2</div>
          <div className="price-div">
            <span className="price">₹ 20,000</span>
            {/* <span className="">&nbsp;for {user.sessionDuration} minutes</span> */}
          </div>
        </div>
      </div>
      <div className="overview_navbar">
        <Nav navbarScroll>
          <Nav.Item>
            <Link
              activeClass="active"
              to="about-description"
              smooth
              spy
              offset={-60}
              duration={0}
            >
              About
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link
              activeClass="active"
              to="time-slots-outer-div"
              spy
              smooth
              offset={-50}
              duration={0}
            >
              Time slots
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link
              activeClass="active"
              to="workEx-outer-div"
              spy
              smooth
              offset={-40}
              duration={0}
            >
              Work Experience
            </Link>
          </Nav.Item>
        </Nav>
      </div>
      <div id="about-description">
        <div>
          <p>
            <DegreesIcon />
            Bachelor of Technology
          </p>
          <p>
            <LanguagesIcon />
            Speaks English
          </p>
          <p>
            <SpecializationsIcon />
            Specialize in
          </p>
        </div>
        <ul className="specialList">
          {/* {user.speciality
            ? user.speciality.split('$').map((domain, i) => (
                <li key={i} className="specialisations">
                  &nbsp;
                  <span>{domain}</span>
                </li>
              ))
            : null} */}
          {[...Array(5)].map((_) => (
            <li className="specialisations">
              &nbsp;
              <span>Pure Veg</span>
            </li>
          ))}
        </ul>
        <div className="user-info-div">
          <p>bleh</p>
        </div>
      </div>
      <div id="time-slots-outer-div">
        <div className="overview-subheading">
          <p>Available Time Slots</p>
          <button
            className="overview-btn"
            onClick={() => navigate('/schedule')}
          >
            Edit Time Slots
          </button>
        </div>
        <div className="overview-table-div">
          <div className="overview-component-header">
            <div className="table-header-date">
              <DatePickerComponent
                format="dd MMM"
                id="startTime"
                data-name="startTime"
                value={visibleDate}
                className="e-field"
                // eslint-disable-next-line react/jsx-no-bind
                change={onDateChanged}
              />
            </div>
            <div className="icons-div purple">
              <input
                type="checkbox"
                name="therapy"
                onChange={handleSlotsVisibility}
                checked={visibleSlots.therapy}
              />
              <span>1hr</span>
            </div>
            <div className="icons-div orange">
              <input
                type="checkbox"
                name="consultation"
                onChange={handleSlotsVisibility}
                checked={visibleSlots.consultation}
              />
              <span>15min</span>
            </div>
          </div>
          <div className="slots-display-div">
            {visibleSlots.therapy && (
              <div className="hour-slots-div">
                {schedules
                  .filter((item) => {
                    const date = moment(item.startTime.toString())
                      .local()
                      .format('MMM DD YYYY');
                    const currD = moment(visibleDate.toString())
                      .local()
                      .format('MMM DD YYYY');
                    return (
                      date === currD && item.sessionType === 'Therapy Session'
                    );
                  })
                  .map((item) => {
                    return (
                      <div key={item.startTime} className="slot">
                        {moment(item.startTime.toString()).local().format('LT')}
                      </div>
                    );
                  })}
              </div>
            )}
            {visibleSlots.consultation && (
              <div className="min-slots-div">
                {schedules
                  .filter((item) => {
                    const date = moment(item.startTime.toString())
                      .local()
                      .format('MMM DD YYYY');
                    const currD = moment(visibleDate.toString())
                      .local()
                      .format('MMM DD YYYY');
                    return (
                      date === currD && item.sessionType === 'Consultation Call'
                    );
                  })
                  .map((item) => {
                    return (
                      <div key={item.startTime} className="slot">
                        {moment(item.startTime.toString()).local().format('LT')}
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      </div>
      {visibilityDialog && (
        // eslint-disable-next-line react/jsx-no-bind
        <WorkExpDialog
          // eslint-disable-next-line react/jsx-no-bind
          handleDialogVisibility={handleDialogVisibility}
          exp={currExperience}
        />
      )}

      <div id="workEx-outer-div">
        <div className="overview-subheading">
          <p>Work Experience</p>
          <button
            className="overview-btn"
            onClick={() => {
              setCurrExperience(expObject);
              setVisibilityDialog(true);
            }}
          >
            Add Experience
          </button>
        </div>
        <div className="overview-table-div">
          <div className="workEx-body">
            <div className="steps">
              {workExp.map((exp, i) => (
                // eslint-disable-next-line react/jsx-no-bind
                <WorkExp key={i} experience={exp} editWorkExp={editWorkExp} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withSnackbar(Overview);
