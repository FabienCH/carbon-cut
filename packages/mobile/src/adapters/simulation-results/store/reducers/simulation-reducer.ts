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
    .addCase(saveAnswer, (state, { payload }) => {
      const { answer } = payload;
      const stateAnswers = state.answers;
      const updatedAnswers = getTypedObjectKeys(stateAnswers).reduce((answersAcc, sectorKey) => {
        const currentSectorAnswers = stateAnswers[sectorKey];
        if (getTypedObjectKeys(currentSectorAnswers).find((answerKey) => answerKey === getTypedObjectKeys(answer)[0])) {
          answersAcc = { ...answersAcc, [sectorKey]: { ...answersAcc[sectorKey], ...answer } };
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
