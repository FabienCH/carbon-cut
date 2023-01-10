import { SimulationDto } from 'carbon-cut-commons';

export const CarbonFootprintRepositoryToken = Symbol.for('CarbonFootprintRepository');

export interface CarbonFootprintRepository {
  calculate(simulationDto: SimulationDto): Promise<number>;
}
