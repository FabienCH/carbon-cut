import { CarbonFootprint } from '@domain/types/carbon-footprint';
import { AlimentationAnswers, SimulationAnswers, TransportAnswers } from '@domain/types/simulation-answers';

export const SimulationStoreToken = Symbol.for('SimulationStore');

export type PickOne<T> = { [P in keyof T]: Record<P, T[P]> & Partial<Record<Exclude<keyof T, P>, undefined>> }[keyof T];

export type AllUnionMember<T> = T extends any ? T : never;
export type AllUnionMemberKeys<T> = T extends any ? keyof T : never;
export type AnswerKey = keyof AlimentationAnswers | keyof TransportAnswers;
export type AnswerValues = AlimentationAnswers[keyof AlimentationAnswers] | Partial<TransportAnswers[keyof TransportAnswers]>;

export interface SimulationStore {
  saveAnswer: (sector: keyof SimulationAnswers, answerKey: AnswerKey, answers: AnswerValues) => void;
  saveAnswerOne: (answer: PickOne<AlimentationAnswers & TransportAnswers>) => void;
  getSimulationsAnswers: () => SimulationAnswers | undefined;
  setCarbonFootprint: (carbonFootprint: CarbonFootprint) => void;
}
