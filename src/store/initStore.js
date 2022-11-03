import throttle from 'lodash/throttle';
import { configureStore } from '@reduxjs/toolkit';
import reducer from './reducers';
import { loadState, saveState } from './localStorage';

const initStore = () => {
  const preloadedState = loadState();

  const store = configureStore({
    reducer,
    preloadedState,
  });

  store.subscribe(throttle(() => {
    saveState({
      schedules: store.getState().schedules,
      workExp: store.getState().workExp,
    });
  }, 1000));

  return store;
};

export default initStore;
