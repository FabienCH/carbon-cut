import { AlimentationData } from '../../entities/simulation-data';

export interface SimulationDataRepository {
  insert(simulationData: AlimentationData): Promise<void>;
  get(): Promise<AlimentationData>;
}
