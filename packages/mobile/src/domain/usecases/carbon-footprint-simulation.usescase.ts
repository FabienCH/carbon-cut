import { BreakfastTypes } from 'carbon-cut-types';
import { inject, injectable } from 'inversify';
import { CarbonFootprintRepository, CarbonFootprintRepositoryToken } from '../ports/repositories/carbon-footprint.repository';
import { SimulationStore, SimulationStoreToken } from '../ports/stores/simulation-store';

export const CarbonFootprintSimulationUseCaseToken = Symbol.for('CarbonFootprintSimulationUseCase');

@injectable()
export class CarbonFootprintSimulationUseCase {
  constructor(
    @inject(CarbonFootprintRepositoryToken) private readonly carbonFootprintRepository: CarbonFootprintRepository,
    @inject(SimulationStoreToken) private readonly simulationStore: SimulationStore,
  ) {}

  async execute(breakfast: BreakfastTypes | null): Promise<void> {
    if (breakfast) {
      const footprint = await this.carbonFootprintRepository.calculate({ breakfast });
      this.simulationStore.setFootprint(footprint);
    }
  }
}
