import { SimulationDto } from 'carbon-cut-types';

export interface CarbonFootprintRepository {
  calculate(simulationDto: SimulationDto): Promise<number>;
}
