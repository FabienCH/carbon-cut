import { createAction } from '@reduxjs/toolkit';
import { CarbonFootprintDto, SimulationDto } from 'carbon-cut-commons';

export const setCarbonFootprint = createAction<CarbonFootprintDto>('[Simulation] Set Carbon Footprint');
export const saveAnswer = createAction<Partial<SimulationDto>>('[Simulation] Save Answer');

export type SimulationActionTypes = typeof setCarbonFootprint | typeof saveAnswer;
