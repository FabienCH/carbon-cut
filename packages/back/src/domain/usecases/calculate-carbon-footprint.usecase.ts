import { Inject } from '@nestjs/common';
import { CarbonFootprintDto, SimulationDto } from 'carbon-cut-commons';
import { Simulation } from '../entities/simulation';
import { SimulationDataRepository, SimulationDataRepositoryToken } from '../ports/repositories/simulation-data.repository';

export class CalculateCarbonFootprintUseCase {
  constructor(@Inject(SimulationDataRepositoryToken) private readonly simulationDataRepository: SimulationDataRepository) {}

  async execute(simulationDto: SimulationDto): Promise<CarbonFootprintDto> {
    const simulationData = await this.simulationDataRepository.get();
    const simulation = new Simulation(simulationDto, simulationData);
    return simulation.calculate();
  }
}
