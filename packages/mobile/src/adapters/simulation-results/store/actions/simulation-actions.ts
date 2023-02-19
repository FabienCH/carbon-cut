import { createAction } from '@reduxjs/toolkit';
import { CarbonFootprintDto, SimulationDto } from 'carbon-cut-commons';
import { AnswerToSave } from '../../../../domain/ports/stores/simulation-store';

export const setCarbonFootprint = createAction<CarbonFootprintDto>('[Simulation] Set Carbon Footprint');
export const saveAnswer = createAction<{ sector: keyof SimulationDto; answer: Partial<AnswerToSave> }>('[Simulation] Save Answer');

export type SimulationActionTypes = typeof setCarbonFootprint | typeof saveAnswer;
