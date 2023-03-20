import { PickOne } from '@domain/ports/stores/simulation-store';
import { AlimentationAnswers, TransportAnswers } from '@domain/types/simulation-answers';
import { createAction } from '@reduxjs/toolkit';
import { CarbonFootprintDto } from 'carbon-cut-commons';

export const setCarbonFootprint = createAction<CarbonFootprintDto>('[Simulation] Set Carbon Footprint');

export const saveAnswer = createAction<{
  answer: PickOne<AlimentationAnswers & TransportAnswers>;
}>('[Simulation] Save Answer');

export type SimulationActionTypes = typeof setCarbonFootprint | typeof saveAnswer;
