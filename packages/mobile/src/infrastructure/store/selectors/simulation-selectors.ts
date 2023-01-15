import { createSelector } from '@reduxjs/toolkit';
import { CarbonFootprintDto, SimulationDto } from 'carbon-cut-commons';
import { appStore } from '../app-store';
import { SimulationState } from '../reducers/simulation-reducer';

const selectSimulationState = (state: SimulationState) => state;

export const simulationResultsSelector = createSelector([selectSimulationState], (simulationState) => {
  if (simulationState.simulationResults) {
    return simulationState.simulationResults;
  }
});

export const answersSelector = createSelector([selectSimulationState], (simulationState) => {
  return simulationState.answers as SimulationDto;
});

export const selectSimulationResults = (): CarbonFootprintDto | undefined => simulationResultsSelector(appStore.getState());
export const selectSimulationAnswers = (): SimulationDto | undefined => answersSelector(appStore.getState());
