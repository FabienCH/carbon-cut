import { createSelector } from '@reduxjs/toolkit';
import { CarbonFootprintDto } from 'carbon-cut-commons';
import { appStore } from '../app-store';
import { SimulationState } from '../reducers/simulation-reducer';

const selectSimulationState = (state: SimulationState) => state;

export const simulationResultsSelector = createSelector([selectSimulationState], (simulationState) => {
  return simulationState.simulationResults;
});

export const selectSimulationResults = (): CarbonFootprintDto | undefined => simulationResultsSelector(appStore.getState());
