import { AnswerKey, AnswerValues, PickOne } from '@domain/ports/stores/simulation-store';
import { AlimentationAnswers, SimulationAnswers, TransportAnswers } from '@domain/types/simulation-answers';
import { createAction } from '@reduxjs/toolkit';
import { CarbonFootprintDto } from 'carbon-cut-commons';

export const setCarbonFootprint = createAction<CarbonFootprintDto>('[Simulation] Set Carbon Footprint');
export const saveAnswer = createAction<{
  sector: keyof SimulationAnswers;
  answerKey: AnswerKey;
  answers: AnswerValues;
}>('[Simulation] Save Answer');

export const saveAnswerOne = createAction<{
  answer: PickOne<AlimentationAnswers & TransportAnswers>;
}>('[Simulation] Save Answer One');

export type SimulationActionTypes = typeof setCarbonFootprint | typeof saveAnswer | typeof saveAnswerOne;
