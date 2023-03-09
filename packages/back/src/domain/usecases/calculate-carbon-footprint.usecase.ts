import { CarbonFootprint } from '@domain/types/carbon-footprint';
import { SimulationAnswers } from '@domain/types/simulation-answers';
import { Inject } from '@nestjs/common';
import { Simulation } from '../entities/simulation';
import { SimulationDataRepository, SimulationDataRepositoryToken } from '../ports/repositories/simulation-data.repository';

export class CalculateCarbonFootprintUseCase {
  constructor(@Inject(SimulationDataRepositoryToken) private readonly simulationDataRepository: SimulationDataRepository) {}

  async execute(simulationAnswers: SimulationAnswers): Promise<CarbonFootprint> {
    const simulationData = await this.simulationDataRepository.get();
    const simulation = new Simulation(simulationAnswers, simulationData);
    return simulation.calculate();
  }
}
