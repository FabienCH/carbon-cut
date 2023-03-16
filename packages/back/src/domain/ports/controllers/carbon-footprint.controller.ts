import { CarbonFootprint } from '@domain/types/carbon-footprint';
import { SimulationAnswers } from '@domain/types/simulation-answers';

export interface CarbonFootprintController {
  calculate(simulationAnswers: SimulationAnswers): Promise<CarbonFootprint>;
}
