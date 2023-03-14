import { AnswerKey, AnswerValues } from '@domain/ports/stores/simulation-store';
import { CarbonFootprint } from '@domain/types/carbon-footprint';
import { AlimentationAnswers, TransportAnswers } from '@domain/types/simulation-answers';
import { createReducer } from '@reduxjs/toolkit';
import { saveAnswer, setCarbonFootprint } from '../actions/simulation-actions';

interface SimulationStateAnswers {
  alimentation: Partial<AlimentationAnswers>;
  transport: Partial<TransportAnswers>;
}

export interface SimulationState {
  answers: SimulationStateAnswers;
  simulationResults?: CarbonFootprint;
}

const initialAnswers: SimulationStateAnswers = { alimentation: {}, transport: {} };
const initialState: SimulationState = { answers: initialAnswers };

export const simulationReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setCarbonFootprint, (state, { payload }) => ({ ...state, simulationResults: payload }))
    .addCase(saveAnswer, (state, { payload }) => {
      const { answers, answerKey } = payload;
      const currentSectorAnswers = { ...state.answers[payload.sector] };
      const currentCategoryAnswers = getCategoryAnswers(currentSectorAnswers, answerKey);
      const sectorAnswers = {
        ...currentSectorAnswers,
        [answerKey]: isObject(currentCategoryAnswers) && isObject(answers) ? { ...currentCategoryAnswers, ...answers } : answers,
      };

      return {
        ...state,
        answers: { ...state.answers, [payload.sector]: sectorAnswers },
      };
    })
    .addDefaultCase((state) => state);
});

const getCategoryAnswers = (
  currentSectorAnswers: Partial<AlimentationAnswers> | Partial<TransportAnswers>,
  answerKey: AnswerKey,
): AnswerValues | undefined => {
  if (isKeyOfSectorAnswers(currentSectorAnswers, answerKey)) {
    return currentSectorAnswers[answerKey];
  }
};

const isObject = (answerValues: AnswerValues): answerValues is object =>
  !!answerValues && typeof answerValues === 'object' && !Array.isArray(answerValues);

const isKeyOfSectorAnswers = (
  currentSectorAnswers: Partial<AlimentationAnswers> | Partial<TransportAnswers>,
  answerKey: AnswerKey,
): answerKey is keyof typeof currentSectorAnswers => !!answerKey && answerKey in currentSectorAnswers;
