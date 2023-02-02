import { AlimentationData } from '../../types/alimentation-types';

export const SimulationDataRepositoryToken = 'SimulationDataRepository';

export interface SimulationDataRepository {
  insert(simulationData: AlimentationData): Promise<void>;
  get(): Promise<AlimentationData>;
}
