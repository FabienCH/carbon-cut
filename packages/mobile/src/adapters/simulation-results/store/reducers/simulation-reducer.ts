import { createReducer } from '@reduxjs/toolkit';
import { AlimentationDto, CarbonFootprintDto, TransportDto } from 'carbon-cut-commons';
import { AnswerKey, AnswerValues } from '../../../../domain/ports/stores/simulation-store';
import { saveAnswer, setCarbonFootprint } from '../actions/simulation-actions';

interface SimulationStateAnswers {
  alimentation: Partial<AlimentationDto>;
  transport: Partial<TransportDto>;
}

export interface SimulationState {
  answers: SimulationStateAnswers;
  simulationResults?: CarbonFootprintDto;
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
  currentSectorAnswers: Partial<AlimentationDto> | Partial<TransportDto>,
  answerKey: AnswerKey,
): AnswerValues | undefined => {
  if (isKeyOfSectorAnswers(currentSectorAnswers, answerKey)) {
    return currentSectorAnswers[answerKey];
  }
};

const isObject = (answerValues: AnswerValues): answerValues is object =>
  !!answerValues && typeof answerValues === 'object' && !Array.isArray(answerValues);

const isKeyOfSectorAnswers = (
  currentSectorAnswers: Partial<AlimentationDto> | Partial<TransportDto>,
  answerKey: AnswerKey,
): answerKey is keyof typeof currentSectorAnswers => !!answerKey && answerKey in currentSectorAnswers;
