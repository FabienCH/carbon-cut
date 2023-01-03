import { BreakfastTypes } from 'carbon-cut-types';
import { NumberFormatter } from '../entities/number-formatter';
import { SimulationDataRepository } from '../ports/repositories/simulation-data.repository';

export class CalculateCarbonFootprintUseCase {
  constructor(private readonly simulationDataRepository: SimulationDataRepository) {}

  async execute({ breakfast }: { breakfast: BreakfastTypes }): Promise<number> {
    const alimentationData = await this.simulationDataRepository.get();

    return NumberFormatter.roundNumber(alimentationData.footprints[breakfast] * 365, 3);
  }
}
