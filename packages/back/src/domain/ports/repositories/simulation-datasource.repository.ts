import { DataRecord } from '../../entities/data-record';

export type SimulationSectors = 'alimentation';

export interface SimulationDataSourceRepository {
  getBySector(sector: SimulationSectors): Promise<DataRecord>;
}
