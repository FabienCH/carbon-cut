import { Inject } from '@nestjs/common';
import { BreakfastTypes } from 'carbon-cut-types';
import { SimulationDataRepositoryToken } from '../../adapters/repositories/mongo-simulation-data.repository';
import { NumberFormatter } from '../entities/number-formatter';
import { SimulationDataRepository } from '../ports/repositories/simulation-data.repository';

export class CalculateCarbonFootprintUseCase {
  constructor(@Inject(SimulationDataRepositoryToken) private readonly simulationDataRepository: SimulationDataRepository) {}

  async execute({ breakfast }: { breakfast: BreakfastTypes }): Promise<number> {
    const alimentationData = await this.simulationDataRepository.get();

    return NumberFormatter.roundNumber(alimentationData.footprints[breakfast] * 365, 3);
  }
}
