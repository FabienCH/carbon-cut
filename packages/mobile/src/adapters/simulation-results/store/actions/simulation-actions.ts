import { QuestionIds } from '@domain/entites/questions-navigation';
import { AnswerToSave } from '@domain/ports/stores/simulation-store';
import { createAction } from '@reduxjs/toolkit';
import { CarbonFootprintDto } from 'carbon-cut-commons';

export const setCarbonFootprint = createAction<CarbonFootprintDto>('[Simulation] Set Carbon Footprint');
export const saveAnswer = createAction<{ answer: AnswerToSave }>('[Simulation] Save Answer');
export const setCurrentQuestion = createAction<QuestionIds>('[Simulation] Set Current Question');

export type SimulationActionTypes = typeof setCarbonFootprint | typeof saveAnswer | typeof setCurrentQuestion;
