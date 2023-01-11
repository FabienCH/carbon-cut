import { createAction } from '@reduxjs/toolkit';

export const setFootprint = createAction<number>('[Simulation] Set Carbon Footprint');

export type SimulationActionTypes = typeof setFootprint;
