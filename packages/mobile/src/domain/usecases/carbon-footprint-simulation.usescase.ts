import { inject, injectable } from 'inversify';
import { selectSimulationAnswers } from '../../infrastructure/store/selectors/simulation-selectors';
import { CarbonFootprintGateway, CarbonFootprintGatewayToken } from '../ports/gateways/carbon-footprint.gateway';
import { LoadingStore, LoadingStoreToken } from '../ports/stores/loading-store';
import { SimulationStore, SimulationStoreToken } from '../ports/stores/simulation-store';

export const CarbonFootprintSimulationUseCaseToken = Symbol.for('CarbonFootprintSimulationUseCase');

@injectable()
export class CarbonFootprintSimulationUseCase {
  constructor(
    @inject(CarbonFootprintGatewayToken) private readonly carbonFootprintGateway: CarbonFootprintGateway,
    @inject(SimulationStoreToken) private readonly simulationStore: SimulationStore,
    @inject(LoadingStoreToken) private readonly loadingStore: LoadingStore,
  ) {}

  async execute(): Promise<void> {
    this.loadingStore.setLoading(true);
    const simulationAnswers = selectSimulationAnswers();
    if (simulationAnswers) {
      try {
        const carbonFootprint = await this.carbonFootprintGateway.calculate(simulationAnswers);
        this.simulationStore.setCarbonFootprint(carbonFootprint);
      } catch (e) {
        console.error(e);
      }
      this.loadingStore.setLoading(false);
    }
  }
}
