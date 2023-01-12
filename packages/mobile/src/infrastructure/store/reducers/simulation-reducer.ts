import { createReducer } from '@reduxjs/toolkit';
import { CarbonFootprintDto } from 'carbon-cut-commons';
import { setCarbonFootprint } from '../actions/simulation-actions';
export interface SimulationState {
  simulationResults?: CarbonFootprintDto;
}

const initialState: SimulationState = {};

export const simulationReducer = createReducer(initialState, (builder) => {
  builder.addCase(setCarbonFootprint, (state, { payload }) => ({ ...state, simulationResults: payload })).addDefaultCase((state) => state);
});
