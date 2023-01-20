import { ColdBeveragesFootprints, HotBeveragesFootprints } from './beverages-dto';

export interface CarbonFootprintDto {
  breakfast?: number;
  hotBeverages?: HotBeveragesFootprints;
  coldBeverages?: ColdBeveragesFootprints;
  total: number;
}
