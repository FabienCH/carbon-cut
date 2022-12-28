import { DataRecord } from '../entities/data-record';

export type SimulationSectors = 'alimentation';

export interface SimulationDataRepository {
  getBySector(sector: SimulationSectors): Promise<DataRecord>;
}
