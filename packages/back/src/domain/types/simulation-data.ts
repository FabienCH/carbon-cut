import { AlimentationData } from './alimentation-types';
import { TransportData } from './transport-types';

export interface SimulationData {
  alimentationData: AlimentationData;
  transportData: TransportData;
}
