import { AUTH, FETCH_COUPONS, FETCH_MHPS, FETCH_SCHEDULE, FETCH_WORKEXP, LOGOUT } from '../constants/actionTypes';
import * as api from '../api/index';

export const signin = (form) => async (dispatch) => {
  try {
    const { data } = await api.signIn(form);
    if (data.user.userType !== 'MHP') {
      dispatch({ type: LOGOUT });
      return 'regular users not allowed';
    }
    dispatch({ type: AUTH, data });
    const schedule = await api.fetchSchedule(data.user.id);
    dispatch({ type: FETCH_SCHEDULE, payload: schedule.data });
    const coupons = await api.fetchCoupons(data.user.id);
    dispatch({ type: FETCH_COUPONS, payload: coupons.data });
    const workExp = await api.fetchWorkExp(data.user.id);
    dispatch({ type: FETCH_WORKEXP, payload: workExp.data });
    if (data.user.email === process.env.REACT_APP_ADMIN_EMAIL) {
      const mhps = await api.fetchMhps();
      dispatch({ type: FETCH_MHPS, payload: mhps.data });
    }
    return data;
  } catch (error) {
    return error.response.data.message[0].messages[0].message;
  }
};

export const signup = (form) => async (dispatch) => {
  try {
    const { data } = await api.signUp(form);
    dispatch({ type: AUTH, data });
  } catch (error) {
    return error.response.data.message[0].messages[0].message;
  }
};

export const googleSignIn = (search) => async (dispatch) => {
  try {
    const { data } = await api.googleSignIn(search);
    dispatch({ type: AUTH, data });
    const schedule = await api.fetchSchedule(data.user.id);
    dispatch({ type: FETCH_SCHEDULE, payload: schedule.data });
    const coupons = await api.fetchCoupons(data.user.id);
    dispatch({ type: FETCH_COUPONS, payload: coupons.data });
    const workExp = await api.fetchWorkExp(data.user.id);
    dispatch({ type: FETCH_WORKEXP, payload: workExp.data });
  } catch (error) {
    return error;
  }
};
