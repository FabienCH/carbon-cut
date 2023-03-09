import { ColdBeveragesFootprints, HotBeveragesFootprints, MealsFootprints } from 'carbon-cut-commons';

export interface AlimentationFootprint {
  breakfast?: number;
  hotBeverages?: HotBeveragesFootprints;
  coldBeverages?: ColdBeveragesFootprints;
  meals: MealsFootprints;
  total: number;
}

export interface TransportFootprint {
  car?: number;
  total: number;
}

export interface CarbonFootprint {
  alimentation: AlimentationFootprint;
  transport: TransportFootprint;
  total: number;
}
