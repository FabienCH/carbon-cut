import { SimulationDto } from 'carbon-cut-types';

export interface CarbonFootprintController {
  calculate(simulationAnswers: SimulationDto): Promise<number>;
}
