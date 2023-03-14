import { AnswerKey, AnswerValues } from '@domain/ports/stores/simulation-store';
import { CarbonFootprint } from '@domain/types/carbon-footprint';
import { SimulationAnswers } from '@domain/types/simulation-answers';
import { createAction } from '@reduxjs/toolkit';

export const setCarbonFootprint = createAction<CarbonFootprint>('[Simulation] Set Carbon Footprint');
export const saveAnswer = createAction<{ sector: keyof SimulationAnswers; answerKey: AnswerKey; answers: AnswerValues }>(
  '[Simulation] Save Answer',
);

export type SimulationActionTypes = typeof setCarbonFootprint | typeof saveAnswer;
