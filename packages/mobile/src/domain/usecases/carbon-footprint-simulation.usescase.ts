import { inject, injectable } from 'inversify';
import { selectSimulationAnswers } from '../../infrastructure/store/selectors/simulation-selectors';
import { CarbonFootprintGateway, CarbonFootprintGatewayToken } from '../ports/gateways/carbon-footprint.gateway';
import { SimulationStore, SimulationStoreToken } from '../ports/stores/simulation-store';

export const CarbonFootprintSimulationUseCaseToken = Symbol.for('CarbonFootprintSimulationUseCase');

@injectable()
export class CarbonFootprintSimulationUseCase {
  constructor(
    @inject(CarbonFootprintGatewayToken) private readonly carbonFootprintGateway: CarbonFootprintGateway,
    @inject(SimulationStoreToken) private readonly simulationStore: SimulationStore,
  ) {}

  async execute(): Promise<void> {
    const simulationAnswers = selectSimulationAnswers();
    if (simulationAnswers) {
      const carbonFootprint = await this.carbonFootprintGateway.calculate(simulationAnswers);
      this.simulationStore.setCarbonFootprint(carbonFootprint);
    }
  }
}
