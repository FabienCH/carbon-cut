import { SimulationDto } from 'carbon-cut-types';

export const CarbonFootprintRepositoryToken = Symbol.for('CarbonFootprintRepository');

export interface CarbonFootprintRepository {
  calculate(simulationDto: SimulationDto): Promise<number>;
}
