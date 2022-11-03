/* eslint-disable default-param-last */
import { FETCH_WORKEXP, CREATE_WORKEXP, UPDATE_WORKEXP, DELETE_WORKEXP } from '../../constants/actionTypes';

const workExpReducer = (state = { workExp: [] }, action) => {
  switch (action.type) {
    case FETCH_WORKEXP:
      return { ...state, workExp: action.payload };

    case CREATE_WORKEXP:
      return { ...state, workExp: [action.payload, ...state.workExp] };

    case UPDATE_WORKEXP:
      return { ...state, workExp: state.workExp.map((exp) => (exp.id === action.payload.id ? action.payload : exp)) };

    case DELETE_WORKEXP:
      return { ...state, workExp: state.workExp.filter((exp) => exp.id !== action.payload) };

    default:
      return state;
  }
};

export default workExpReducer;
