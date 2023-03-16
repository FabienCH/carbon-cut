import { CarbonFootprint } from '@domain/types/carbon-footprint';
import { AlimentationAnswers, SimulationAnswers, TransportAnswers } from '@domain/types/simulation-answers';

export const SimulationStoreToken = Symbol.for('SimulationStore');

export type AnswerKey = keyof AlimentationAnswers | keyof TransportAnswers;
export type AnswerValues = AlimentationAnswers[keyof AlimentationAnswers] | Partial<TransportAnswers[keyof TransportAnswers]>;

export interface SimulationStore {
  saveAnswer: (sector: keyof SimulationAnswers, answerKey: AnswerKey, answers: AnswerValues) => void;
  getSimulationsAnswers: () => SimulationAnswers | undefined;
  setCarbonFootprint: (carbonFootprint: CarbonFootprint) => void;
}
