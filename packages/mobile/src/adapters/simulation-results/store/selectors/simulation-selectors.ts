import { CarbonFootprint } from '@domain/types/carbon-footprint';
import { SimulationAnswers } from '@domain/types/simulation-answers';
import { createSelector } from '@reduxjs/toolkit';
import { AppState, appStore } from '../../../commons/store/app-store';

const selectSimulationState = (state: AppState) => state.simulation;

export const simulationResultsSelector = createSelector(selectSimulationState, (simulationState) => {
  if (simulationState.simulationResults) {
    return simulationState.simulationResults;
  }
});

export const answersSelector = createSelector(selectSimulationState, (simulationState) => {
  return simulationState.answers as SimulationAnswers;
});

export const selectSimulationResults = (): CarbonFootprint | undefined => simulationResultsSelector(appStore.getState());
export const selectSimulationAnswers = (): SimulationAnswers | undefined => answersSelector(appStore.getState());
