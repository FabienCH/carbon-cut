import { AlimentationData } from '../../entities/simulation-data';

export const SimulationDataRepositoryToken = 'SimulationDataRepository';

export interface SimulationDataRepository {
  insert(simulationData: AlimentationData): Promise<void>;
  get(): Promise<AlimentationData>;
}
