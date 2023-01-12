import { SimulationDto } from 'carbon-cut-commons';
import { inject, injectable } from 'inversify';
import { CarbonFootprintGateway, CarbonFootprintGatewayToken } from '../ports/gateways/carbon-footprint.gateway';
import { SimulationStore, SimulationStoreToken } from '../ports/stores/simulation-store';

export const CarbonFootprintSimulationUseCaseToken = Symbol.for('CarbonFootprintSimulationUseCase');

@injectable()
export class CarbonFootprintSimulationUseCase {
  constructor(
    @inject(CarbonFootprintGatewayToken) private readonly carbonFootprintGateway: CarbonFootprintGateway,
    @inject(SimulationStoreToken) private readonly simulationStore: SimulationStore,
  ) {}

  async execute(simulationDto: SimulationDto): Promise<void> {
    const carbonFootprint = await this.carbonFootprintGateway.calculate(simulationDto);
    this.simulationStore.setCarbonFootprint(carbonFootprint);
  }
}
