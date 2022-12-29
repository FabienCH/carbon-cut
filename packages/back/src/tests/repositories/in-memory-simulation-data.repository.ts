import { AlimentationData } from '../../domain/entities/simulation-data';
import { SimulationDataRepository } from '../../domain/repositories/simulation-data.repository';

export class InMemorySimulationDataRepository implements SimulationDataRepository {
  simulationData: AlimentationData;

  async insert(simulationData: AlimentationData): Promise<void> {
    this.simulationData = simulationData;
    return;
  }
}
