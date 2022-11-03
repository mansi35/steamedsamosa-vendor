import { CREATE_COUPON, FETCH_COUPONS } from '../constants/actionTypes';
import * as api from '../api/index';

export const getCoupons = (mhpId) => async (dispatch) => {
  try {
    const { data } = await api.fetchCoupons(mhpId);
    dispatch({ type: FETCH_COUPONS, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const createCoupon = (schedule) => async (dispatch) => {
  try {
    const { data } = await api.createCoupon(schedule);
    dispatch({ type: CREATE_COUPON, payload: data });
    console.log(data);
  } catch (error) {
    console.log(error.message);
  }
};
