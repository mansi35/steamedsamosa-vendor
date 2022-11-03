/* eslint-disable default-param-last */
import { FETCH_MHPS, UPDATE_MHP } from '../../constants/actionTypes';

const mhpReducer = (state = { mhps: [] }, action) => {
  switch (action.type) {
    case FETCH_MHPS:
      return { ...state, mhps: action.payload };

    case UPDATE_MHP:
      return { ...state, mhps: state.mhps.map((mhp) => (mhp.id === action.payload.id ? action.payload : mhp)) };

    default:
      return state;
  }
};

export default mhpReducer;
