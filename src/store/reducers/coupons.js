/* eslint-disable default-param-last */
import { CREATE_COUPON, FETCH_COUPONS } from '../../constants/actionTypes';

const couponsReducer = (state = { coupons: [] }, action) => {
  switch (action.type) {
    case FETCH_COUPONS:
      return { ...state, coupons: action.payload };

    case CREATE_COUPON:
      return { ...state, coupons: [action.payload, ...state.coupons] };

    default:
      return state;
  }
};

export default couponsReducer;
