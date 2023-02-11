import { TransportData } from 'src/domain/types/transport-types';
import { AlimentationData } from './alimentation-types';

export interface SimulationData {
  alimentationData: AlimentationData;
  transportData: TransportData;
}
