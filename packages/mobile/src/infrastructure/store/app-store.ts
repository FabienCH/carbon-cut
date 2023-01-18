import { configureStore } from '@reduxjs/toolkit';
import { loadingReducer, LoadingState } from './reducers/loading-reducer';
import { simulationReducer, SimulationState } from './reducers/simulation-reducer';

export interface AppState {
  loading: LoadingState;
  simulation: SimulationState;
}

export const appStore = configureStore({
  reducer: { loading: loadingReducer, simulation: simulationReducer },
  devTools: process.env.NODE_ENV !== 'production',
});
