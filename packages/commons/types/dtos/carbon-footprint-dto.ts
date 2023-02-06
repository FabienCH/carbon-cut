import { ColdBeveragesFootprints, HotBeveragesFootprints } from './beverages-dto';
import { MealsFootprints } from './meals-dto';

export interface CarbonFootprintDto {
  breakfast?: number;
  hotBeverages?: HotBeveragesFootprints;
  coldBeverages?: ColdBeveragesFootprints;
  meals: MealsFootprints;
  total: number;
}
