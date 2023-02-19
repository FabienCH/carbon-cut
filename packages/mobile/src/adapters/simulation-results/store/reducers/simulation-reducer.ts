import { createReducer } from '@reduxjs/toolkit';
import { CarbonFootprintDto, SimulationDto } from 'carbon-cut-commons';
import { saveAnswer, setCarbonFootprint } from '../actions/simulation-actions';
export interface SimulationState {
  answers: Partial<SimulationDto>;
  simulationResults?: CarbonFootprintDto;
}

const initialState: SimulationState = { answers: {} };

export const simulationReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setCarbonFootprint, (state, { payload }) => ({ ...state, simulationResults: payload }))
    .addCase(saveAnswer, (state, { payload }) => ({
      ...state,
      answers: { ...state.answers, [payload.sector]: { ...state.answers[payload.sector], ...payload.answer } },
    }))
    .addDefaultCase((state) => state);
});
