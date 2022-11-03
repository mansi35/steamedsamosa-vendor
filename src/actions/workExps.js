import { CREATE_WORKEXP, FETCH_WORKEXP, UPDATE_WORKEXP, DELETE_WORKEXP } from '../constants/actionTypes';
import * as api from '../api/index';

export const getWorkExp = (mhpId) => async (dispatch) => {
  try {
    const { data } = await api.fetchWorkExp(mhpId);
    dispatch({ type: FETCH_WORKEXP, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const createWorkExp = (schedule) => async (dispatch) => {
  try {
    const { data } = await api.createWorkExp(schedule);
    dispatch({ type: CREATE_WORKEXP, payload: data });
  } catch (error) {
    console.log(error.message);
  }
};

export const updateWorkExp = (scheduleId, schedule) => async (dispatch) => {
  try {
    const { data } = await api.updateWorkExp(scheduleId, schedule);
    console.log(data);
    dispatch({ type: UPDATE_WORKEXP, payload: data });
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteWorkExp = (id) => async (dispatch) => {
  try {
    await api.deleteWorkExp(id);
    dispatch({ type: DELETE_WORKEXP, payload: id });
  } catch (error) {
    console.log(error.message);
  }
};
