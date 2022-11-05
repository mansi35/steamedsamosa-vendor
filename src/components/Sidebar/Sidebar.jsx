import React from 'react';
import { useDispatch } from 'react-redux';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { withSnackbar } from 'notistack';
import { IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EventNoteIcon from '@mui/icons-material/EventNote';
import EditIcon from '@mui/icons-material/Edit';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { ReactComponent as AddTimeSlotsIcon } from '../../assets/addTimeSlot.svg';
// import { ReactComponent as CouponsIcon } from '../../assets/coupons-icon.svg';
import { ReactComponent as LogoutIcon } from '../../assets/logout-icon.svg';
import Header from '../Header/Header';
import { LOGOUT } from '../../constants/actionTypes';
import './Sidebar.scss';

function Sidebar({ enqueueSnackbar }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    dispatch({ type: LOGOUT });
    enqueueSnackbar('Successfully logged out!');
    navigate('/auth');
  };

  const toggleSidebar = () => {
    document.getElementById('sidebar').classList.toggle('active');
  };

  return location.pathname !== '/auth' && location.pathname !== '/admin' && (
    <div className="navigation">
      <Header />
      <div className="sidebar" id="sidebar">
        <div className="sidebar__content">
          <NavLink
            className="tabs"
            to="/"
          >
            <div role="banner" onClick={toggleSidebar}>
              <VisibilityIcon />
              <p>Overview</p>
            </div>
          </NavLink>
          <NavLink
            className="tabs"
            to="/appointments"
          >
            <div role="banner" onClick={toggleSidebar}>
              <EventNoteIcon />
              <p>Bookings</p>
            </div>
          </NavLink>
          <NavLink
            className="tabs"
            to="/edit-profile"
          >
            <div role="banner" onClick={toggleSidebar}>
              <EditIcon />
              <p>Edit Profile</p>
            </div>
          </NavLink>
          {/* <NavLink
            className="tabs"
            to="/coupons"
          >
            <div role="banner" onClick={toggleSidebar}>
              <CouponsIcon />
              <p>Generate coupons</p>
            </div>
          </NavLink> */}
          <NavLink
            className="tabs"
            to="/schedule"
          >
            <div role="banner" onClick={toggleSidebar}>
              <AddTimeSlotsIcon />
              <p>Add Time Slots</p>
            </div>
          </NavLink>
          <NavLink
            className="tabs"
            to="/wallet"
          >
            <div role="banner" onClick={toggleSidebar}>
              <AccountBalanceWalletIcon />
              <p>My Wallet</p>
            </div>
          </NavLink>
          <div className="sidebar__logout" onClick={logout} role="button">
            <IconButton>
              <LogoutIcon />
            </IconButton>
            <p>Logout</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withSnackbar(Sidebar);
