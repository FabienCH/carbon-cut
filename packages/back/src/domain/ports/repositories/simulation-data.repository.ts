import { SimulationData } from '../../types/simulation-data';

export const SimulationDataRepositoryToken = 'SimulationDataRepository';

export interface SimulationDataRepository {
  insert(simulationData: SimulationData): Promise<void>;
  get(): Promise<SimulationData>;
}
