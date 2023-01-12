import { CarbonFootprintDto } from 'carbon-cut-commons';

export const SimulationStoreToken = Symbol.for('SimulationStore');

export interface SimulationStore {
  setCarbonFootprint: (carbonFootprint: CarbonFootprintDto) => void;
}
