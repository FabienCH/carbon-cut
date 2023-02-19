import { Inject } from '@nestjs/common';
import { SimulationDataSourceMapper } from '../entities/simulation-datasource-mapper';
import { SimulationDataRepository, SimulationDataRepositoryToken } from '../ports/repositories/simulation-data.repository';
import {
  SimulationDataSourceRepository,
  SimulationDataSourceRepositoryToken,
} from '../ports/repositories/simulation-datasource.repository';

export class SimulationDataImportUseCase {
  constructor(
    @Inject(SimulationDataSourceRepositoryToken) private readonly simulationDataSourceRepository: SimulationDataSourceRepository,
    @Inject(SimulationDataRepositoryToken) private readonly simulationDataRepository: SimulationDataRepository,
    private readonly simulationDataMapper: SimulationDataSourceMapper,
  ) {}

  async execute(): Promise<void> {
    const alimentationDatasource = await this.simulationDataSourceRepository.getBySector('alimentation');
    const transportDatasource = await this.simulationDataSourceRepository.getBySector('transport');
    const alimentationData = this.simulationDataMapper.mapAlimentationData(alimentationDatasource);
    const transportData = this.simulationDataMapper.mapTransportData(transportDatasource);
    await this.simulationDataRepository.insert({
      alimentationData,
      transportData,
    });
  }
}
