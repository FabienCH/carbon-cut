import { BreakfastTypes } from 'carbon-cut-commons';
import { inject, injectable } from 'inversify';
import { CarbonFootprintGateway, CarbonFootprintGatewayToken } from '../ports/gateways/carbon-footprint.gateway';
import { SimulationStore, SimulationStoreToken } from '../ports/stores/simulation-store';

export const CarbonFootprintSimulationUseCaseToken = Symbol.for('CarbonFootprintSimulationUseCase');

@injectable()
export class CarbonFootprintSimulationUseCase {
  constructor(
    @inject(CarbonFootprintGatewayToken) private readonly carbonFootprintRepository: CarbonFootprintGateway,
    @inject(SimulationStoreToken) private readonly simulationStore: SimulationStore,
  ) {}

  async execute(breakfast: BreakfastTypes | null): Promise<void> {
    if (breakfast) {
      const footprint = await this.carbonFootprintRepository.calculate({ breakfast });
      this.simulationStore.setFootprint(footprint);
    }
  }
}
