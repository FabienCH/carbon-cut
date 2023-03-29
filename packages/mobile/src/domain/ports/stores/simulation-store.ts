import { QuestionIds } from '@domain/entites/questions-navigation';
import { CarbonFootprint } from '@domain/types/carbon-footprint';
import { AlimentationAnswers, SimulationAnswers, TransportAnswers } from '@domain/types/simulation-answers';

export const SimulationStoreToken = Symbol.for('SimulationStore');

type PickOne<T> = { [P in keyof T]: Record<P, T[P]> & Partial<Record<Exclude<keyof T, P>, undefined>> }[keyof T];
export type AnswerToSave = PickOne<AlimentationAnswers & TransportAnswers>;

export interface SimulationStore {
  saveAnswer: (answer: AnswerToSave) => void;
  getSimulationsAnswers: () => SimulationAnswers | undefined;
  setCarbonFootprint: (carbonFootprint: CarbonFootprint) => void;
  setCurrentQuestion: (questionId: QuestionIds) => void;
  getCurrentQuestion: () => QuestionIds;
}
