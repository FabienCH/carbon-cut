import { Beverages } from '../beverages';

export interface CarbonFootprintDto {
  breakfast?: number;
  beverages?: Partial<Beverages>;
  total: number;
}
