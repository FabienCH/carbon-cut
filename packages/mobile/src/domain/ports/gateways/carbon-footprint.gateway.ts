import { CarbonFootprint } from '@domain/types/carbon-footprint';
import { SimulationAnswers } from '@domain/types/simulation-answers';

export const CarbonFootprintGatewayToken = Symbol.for('CarbonFootprintGateway');

export interface CarbonFootprintGateway {
  calculate(simulationAnswers: SimulationAnswers): Promise<CarbonFootprint>;
}
