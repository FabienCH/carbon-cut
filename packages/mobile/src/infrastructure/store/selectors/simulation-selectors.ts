import { createSelector } from '@reduxjs/toolkit';
import { appStore } from '../app-store';
import { SimulationState } from '../reducers/simulation-reducer';

const selectSimulationState = (state: SimulationState) => state;

export const simulationResultsSelector = createSelector([selectSimulationState], (simulationState) => {
  return simulationState.simulationResults;
});

export const selectSimulationResults = (): number | undefined => simulationResultsSelector(appStore.getState());
