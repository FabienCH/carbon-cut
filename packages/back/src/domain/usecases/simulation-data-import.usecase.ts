import { Inject } from '@nestjs/common';
import { SimulationDataRepositoryToken } from '../../adapters/repositories/file-simulation-data.repository';
import { AlimentationData, SimulationDataMapper } from '../entities/simulation-data-mapper';
import { SimulationDataRepository } from '../repositories/simulation-data.repository';

export class SimulationDataImportUseCase {
  constructor(
    @Inject(SimulationDataRepositoryToken) private readonly simulationDataRepository: SimulationDataRepository,
    private readonly simulationDataMapper: SimulationDataMapper,
  ) {}

  async execute(): Promise<AlimentationData> {
    const alimentation = await this.simulationDataRepository.getBySector('alimentation');
    return this.simulationDataMapper.mapAlimentationData(alimentation);
  }
}
