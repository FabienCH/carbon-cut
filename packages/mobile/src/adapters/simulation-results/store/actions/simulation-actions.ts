import { createAction } from '@reduxjs/toolkit';
import { CarbonFootprintDto, SimulationDto } from 'carbon-cut-commons';
import { AnswerKey, AnswerValues } from '../../../../domain/ports/stores/simulation-store';

export const setCarbonFootprint = createAction<CarbonFootprintDto>('[Simulation] Set Carbon Footprint');
export const saveAnswer = createAction<{ sector: keyof SimulationDto; answerKey: AnswerKey; answers: AnswerValues }>(
  '[Simulation] Save Answer',
);

export type SimulationActionTypes = typeof setCarbonFootprint | typeof saveAnswer;
