import { AnswerKey, AnswerValues } from '@domain/ports/stores/simulation-store';
import { CarbonFootprint } from '@domain/types/carbon-footprint';
import { AlimentationAnswers, TransportAnswers } from '@domain/types/simulation-answers';
import { createReducer } from '@reduxjs/toolkit';
import { getTypedObjectKeys } from 'carbon-cut-commons';
import { saveAnswer, saveAnswerOne, setCarbonFootprint } from '../actions/simulation-actions';

type Nullable<T> = { [P in keyof T]: T[P] | null };

interface SimulationStateAnswers {
  alimentation: Nullable<AlimentationAnswers>;
  transport: Nullable<TransportAnswers>;
}

export interface SimulationState {
  answers: SimulationStateAnswers;
  simulationResults?: CarbonFootprint;
}

const initialAnswers: SimulationStateAnswers = {
  alimentation: { breakfast: null, hotBeverages: null, coldBeverages: null, milkType: null, meals: null },
  transport: { carUsage: null, electricCar: null, fuelCar: null },
};

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
    .addCase(saveAnswerOne, (state, { payload }) => {
      const { answer } = payload;
      const stateAnswers = { ...state.answers };
      const updatedAnswers = getTypedObjectKeys(stateAnswers).reduce((answersAcc, sectorKey) => {
        const currentSectorAnswers = stateAnswers[sectorKey];
        if (getTypedObjectKeys(currentSectorAnswers).find((answerKey) => answerKey === getTypedObjectKeys(answer)[0])) {
          answersAcc = { ...answersAcc, [sectorKey]: answer };
        }
        return answersAcc;
      }, stateAnswers);

      return {
        ...state,
        answers: updatedAnswers,
      };
    })
    .addDefaultCase((state) => state);
});

const getCategoryAnswers = (
  currentSectorAnswers: Nullable<AlimentationAnswers> | Nullable<TransportAnswers>,
  answerKey: AnswerKey,
): AnswerValues | undefined => {
  if (isKeyOfSectorAnswers(currentSectorAnswers, answerKey)) {
    return currentSectorAnswers[answerKey];
  }
};

const isObject = (answerValues: AnswerValues | undefined): answerValues is object =>
  !!answerValues && typeof answerValues === 'object' && !Array.isArray(answerValues);

const isKeyOfSectorAnswers = (
  currentSectorAnswers: Nullable<AlimentationAnswers> | Nullable<TransportAnswers>,
  answerKey: AnswerKey,
): answerKey is keyof typeof currentSectorAnswers => !!answerKey && answerKey in currentSectorAnswers;
