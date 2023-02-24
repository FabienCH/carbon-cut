import { AlimentationDto, CarbonFootprintDto, SimulationDto, TransportDto } from 'carbon-cut-commons';

export const SimulationStoreToken = Symbol.for('SimulationStore');

export type AnswerKey = keyof AlimentationDto | keyof TransportDto;
export type AnswerValues = AlimentationDto[keyof AlimentationDto] | Partial<TransportDto[keyof TransportDto]>;

export interface SimulationStore {
  saveAnswer: (sector: keyof SimulationDto, answerKey: AnswerKey, answers: AnswerValues) => void;
  getSimulationsAnswers: () => SimulationDto | undefined;
  setCarbonFootprint: (carbonFootprint: CarbonFootprintDto) => void;
}
