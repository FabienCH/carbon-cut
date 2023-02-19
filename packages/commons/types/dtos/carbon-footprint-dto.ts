import { ColdBeveragesFootprints, HotBeveragesFootprints } from './beverages-dto';
import { MealsFootprints } from './meals-dto';

export interface AlimentationFootprintDto {
  breakfast?: number;
  hotBeverages?: HotBeveragesFootprints;
  coldBeverages?: ColdBeveragesFootprints;
  meals: MealsFootprints;
  total: number;
}

export interface TransportFootprintDto {
  car?: number;
  total: number;
}

export interface CarbonFootprintDto {
  alimentation: AlimentationFootprintDto;
  transport: TransportFootprintDto;
  total: number;
}
