import { createAction } from '@reduxjs/toolkit';
import { CarbonFootprintDto } from 'carbon-cut-commons';

export const setCarbonFootprint = createAction<CarbonFootprintDto>('[Simulation] Set Carbon Footprint');

export type SimulationActionTypes = typeof setCarbonFootprint;
