import { configureStore } from '@reduxjs/toolkit';
import { simulationReducer, SimulationState } from '../../simulation-results/store/reducers/simulation-reducer';
import { loadingReducer, LoadingState } from './reducers/loading-reducer';

export interface AppState {
  loading: LoadingState;
  simulation: SimulationState;
}

export const appStore = configureStore({
  reducer: { loading: loadingReducer, simulation: simulationReducer },
  devTools: process.env.NODE_ENV !== 'production',
});
