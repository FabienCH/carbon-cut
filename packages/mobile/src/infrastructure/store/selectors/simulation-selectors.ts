import { createSelector } from '@reduxjs/toolkit';
import { CarbonFootprintDto, SimulationDto } from 'carbon-cut-commons';
import { AppState, appStore } from '../app-store';

const selectSimulationState = (state: AppState) => state.simulation;

export const simulationResultsSelector = createSelector(selectSimulationState, (simulationState) => {
  if (simulationState.simulationResults) {
    return simulationState.simulationResults;
  }
});

export const answersSelector = createSelector(selectSimulationState, (simulationState) => {
  return simulationState.answers as SimulationDto;
});

export const selectSimulationResults = (): CarbonFootprintDto | undefined => simulationResultsSelector(appStore.getState());
export const selectSimulationAnswers = (): SimulationDto | undefined => answersSelector(appStore.getState());
