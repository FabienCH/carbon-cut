import { createReducer } from '@reduxjs/toolkit';
import { setFootprint } from '../actions/simulation-actions';
export interface SimulationState {
  simulationResults?: number;
}

const initialState: SimulationState = {};

export const simulationReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setFootprint, (state, { payload }) => {
      return { ...state, simulationResults: payload };
    })
    .addDefaultCase((state) => state);
});
