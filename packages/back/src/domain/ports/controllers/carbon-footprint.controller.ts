import { SimulationAnswers } from '@domain/types/simulation-answers';
import { CarbonFootprint } from 'carbon-cut-commons';

export interface CarbonFootprintController {
  calculate(simulationAnswers: SimulationAnswers): Promise<CarbonFootprint>;
}
