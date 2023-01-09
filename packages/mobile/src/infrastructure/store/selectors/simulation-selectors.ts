import { createSelector } from '@reduxjs/toolkit';
import { SimulationState } from '../reducers/simulation-reducer';

const selectSimulationState = (state: SimulationState) => state;

export const selectSimulationResults = createSelector([selectSimulationState], (simulationState) => {
  return simulationState.simulationResults;
});
