import { CarbonFootprintDto, SimulationDto } from 'carbon-cut-commons';

export const CarbonFootprintGatewayToken = Symbol.for('CarbonFootprintGateway');

export interface CarbonFootprintGateway {
  calculate(simulationDto: SimulationDto): Promise<CarbonFootprintDto>;
}
