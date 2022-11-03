import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { withSnackbar } from 'notistack';
import { LOGOUT } from '../../constants/actionTypes';
import AdminMhpCard from '../../components/AdminMhpCard/AdminMhpCard';
import './Admin.scss';

function Admin({ enqueueSnackbar }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => {
    dispatch({ type: LOGOUT });
    enqueueSnackbar('Successfully logged out!');
    navigate('/auth');
  };

  const { mhps } = useSelector((state) => state.mhps);
  return (
    <div className="admin__profile">
      <div className="admin__logout">
        <button className="btn-submit" onClick={logout}>Logout</button>
      </div>
      <div className="admin__profile-body">
        <h2>MHPs</h2>
        <div className="admin__profile-title">
          <p>Name</p>
          <p>Status</p>
        </div>
        <div className="admins__status">
          {mhps.map((mhp) => <AdminMhpCard mhp={mhp} key={mhp.id} />)}
        </div>
      </div>
    </div>
  );
}
export default withSnackbar(Admin);
