import { AnswerToSave } from '@domain/ports/stores/simulation-store';
import { CarbonFootprint } from '@domain/types/carbon-footprint';
import { Nullable } from '@domain/types/nullable';
import { AlimentationAnswers, TransportAnswers } from '@domain/types/simulation-answers';
import { createReducer } from '@reduxjs/toolkit';
import { getTypedObjectKeys } from 'carbon-cut-commons';
import { saveAnswer, setCarbonFootprint } from '../actions/simulation-actions';

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
    .addCase(saveAnswer, (state, { payload }) => ({ ...state, answers: updateAnswers(state.answers, payload.answer) }))
    .addDefaultCase((state) => state);
});

function updateAnswers(stateAnswers: SimulationStateAnswers, answer: AnswerToSave) {
  return getTypedObjectKeys(stateAnswers).reduce((answersAcc, sectorKey) => {
    const currentSectorAnswersKeys = getTypedObjectKeys(stateAnswers[sectorKey]);
    const savedAnswerKey = getTypedObjectKeys(answer)[0];
    if (currentSectorAnswersKeys.find((answerKey) => answerKey === savedAnswerKey)) {
      answersAcc = { ...answersAcc, [sectorKey]: { ...answersAcc[sectorKey], ...answer } };
    }

    return answersAcc;
  }, stateAnswers);
}
