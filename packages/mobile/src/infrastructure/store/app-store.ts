import { configureStore } from '@reduxjs/toolkit';
import { simulationReducer } from './reducers/simulation-reducer';

export const appStore = configureStore({
  reducer: simulationReducer,
  devTools: process.env.NODE_ENV !== 'production',
});
