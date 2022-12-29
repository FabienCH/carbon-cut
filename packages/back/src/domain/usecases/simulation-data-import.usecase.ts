import { Inject } from '@nestjs/common';
import { SimulationDataSourceRepositoryToken } from '../../adapters/repositories/file-simulation-datasource.repository';
import { SimulationDataRepositoryToken } from '../../adapters/repositories/mongo-simulation-data.repository';
import { SimulationDataSourceMapper } from '../entities/simulation-datasource-mapper';
import { SimulationDataRepository } from '../repositories/simulation-data.repository';
import { SimulationDataSourceRepository } from '../repositories/simulation-datasource.repository';

export class SimulationDataImportUseCase {
  constructor(
    @Inject(SimulationDataSourceRepositoryToken) private readonly simulationDataSourceRepository: SimulationDataSourceRepository,
    @Inject(SimulationDataRepositoryToken) private readonly simulationDataRepository: SimulationDataRepository,
    private readonly simulationDataMapper: SimulationDataSourceMapper,
  ) {}

  async execute(): Promise<void> {
    const alimentation = await this.simulationDataSourceRepository.getBySector('alimentation');
    const alimentationData = this.simulationDataMapper.mapAlimentationData(alimentation);
    await this.simulationDataRepository.insert(alimentationData);
  }
}
