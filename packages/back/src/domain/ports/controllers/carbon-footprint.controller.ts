import { SimulationDto } from 'carbon-cut-commons';

export interface CarbonFootprintController {
  calculate(simulationAnswers: SimulationDto): Promise<number>;
}
