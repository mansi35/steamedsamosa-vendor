import { combineReducers } from 'redux';
import authReducer from './auth';
import scheduleReducer from './schedule';
import workExpReducer from './workExp';

export default combineReducers({
  authData: authReducer,
  schedules: scheduleReducer,
  workExp: workExpReducer,
});
