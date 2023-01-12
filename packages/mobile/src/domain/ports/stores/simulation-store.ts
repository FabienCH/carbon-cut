import { CarbonFootprintDto, SimulationDto } from 'carbon-cut-commons';

export const SimulationStoreToken = Symbol.for('SimulationStore');

export interface SimulationStore {
  saveAnswer: (answer: Partial<SimulationDto>) => void;
  setCarbonFootprint: (carbonFootprint: CarbonFootprintDto) => void;
}
