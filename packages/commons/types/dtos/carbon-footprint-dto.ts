import { HotBeverages } from '../beverages';

export interface CarbonFootprintDto {
  breakfast?: number;
  beverages?: Partial<HotBeverages>;
  total: number;
}
