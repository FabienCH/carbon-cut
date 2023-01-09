import { createReducer } from '@reduxjs/toolkit';
import { setFootprint } from '../actions/simulation-actions';
export interface SimulationState {
  simulationResults?: number;
}

export const simulationReducer = createReducer({}, (builder) => {
  builder
    .addCase(setFootprint, (state, { payload }) => {
      return { ...state, simulationResults: payload };
    })
    .addDefaultCase((state) => state);
});
