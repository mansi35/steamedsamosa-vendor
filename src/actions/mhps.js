import { FETCH_MHPS, UPDATE_MHP } from '../constants/actionTypes';
import * as api from '../api/index';

export const getMhps = () => async (dispatch) => {
  try {
    const { data } = await api.fetchMhps();
    dispatch({ type: FETCH_MHPS, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const updateMhp = (mhpId, mhpStatus) => async (dispatch) => {
  try {
    const { data } = await api.verifyMhp(mhpId, mhpStatus);
    console.log(data);
    dispatch({ type: UPDATE_MHP, payload: data });
  } catch (error) {
    console.log(error.message);
  }
};
