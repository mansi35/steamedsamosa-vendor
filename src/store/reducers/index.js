import { combineReducers } from 'redux';
import authReducer from './auth';
import scheduleReducer from './schedule';
import couponsReducer from './coupons';
import workExpReducer from './workExp';
import mhpReducer from './mhps';

export default combineReducers({
  authData: authReducer,
  schedules: scheduleReducer,
  coupons: couponsReducer,
  workExp: workExpReducer,
  mhps: mhpReducer,
});
