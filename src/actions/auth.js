import { AUTH } from '../constants/actionTypes';
import * as api from '../api/index';

export const signin = (form) => async (dispatch) => {
  try {
    const { data } = await api.signIn(form);
    dispatch({ type: AUTH, data });
    return data;
  } catch (error) {
    return error.response.data.message[0].messages[0].message;
  }
};

export const signup = (form) => async (dispatch) => {
  try {
    const { data } = await api.signUp(form);
    dispatch({ type: AUTH, data });
    return data;
  } catch (error) {
    return error.response.data.message[0].messages[0].message;
  }
};
