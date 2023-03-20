import { CarbonFootprint } from '@domain/types/carbon-footprint';
import { AlimentationAnswers, SimulationAnswers, TransportAnswers } from '@domain/types/simulation-answers';

export const SimulationStoreToken = Symbol.for('SimulationStore');

export type PickOne<T> = { [P in keyof T]: Record<P, T[P]> & Partial<Record<Exclude<keyof T, P>, undefined>> }[keyof T];

export type AllUnionMember<T> = T extends any ? T : never;
export type AllUnionMemberKeys<T> = T extends any ? keyof T : never;

export interface SimulationStore {
  saveAnswer: (answer: PickOne<AlimentationAnswers & TransportAnswers>) => void;
  getSimulationsAnswers: () => SimulationAnswers | undefined;
  setCarbonFootprint: (carbonFootprint: CarbonFootprint) => void;
}
