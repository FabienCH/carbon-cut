import { DataRecord } from '../../types/data-record';

export type SimulationSectors = 'alimentation' | 'transport';

export const SimulationDataSourceRepositoryToken = 'SimulationDataSourceRepository';

export interface SimulationDataSourceRepository {
  getBySector(sector: SimulationSectors): Promise<DataRecord>;
}
