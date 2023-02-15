import { AlimentationDto, CarbonFootprintDto, SimulationDto, TransportDto } from 'carbon-cut-commons';

export const SimulationStoreToken = Symbol.for('SimulationStore');

export type AnswerKey = keyof AlimentationDto | keyof TransportDto;
export type AnswerValue = AlimentationDto[keyof AlimentationDto] | TransportDto[keyof TransportDto];
export type AnswerToSave = {
  [key in AnswerKey]: AnswerValue;
};

export interface SimulationStore {
  saveAnswer: (sector: keyof SimulationDto, answer: Partial<AnswerToSave>) => void;
  getSimulationsAnswers: () => SimulationDto | undefined;
  setCarbonFootprint: (carbonFootprint: CarbonFootprintDto) => void;
}
