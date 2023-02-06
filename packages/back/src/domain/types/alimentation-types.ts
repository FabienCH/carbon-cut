import { BeverageTypes, BreakfastTypes, FoodTypes, MilkTypes } from 'carbon-cut-commons';
import { AlimentationFootprintsMapping, MultipliersMapping, QuantitiesMapping } from '../entities/alimentation/alimentation-data-mapping';

export type AlimentationDataQuantities = {
  [quantityKey in keyof typeof QuantitiesMapping]: number;
};

export type BreakfastMilkTypes = 'cowMilkCerealBreakfast' | 'sojaMilkCerealBreakfast' | 'oatsMilkCerealBreakfast';

export type BreakfastWithMilkTypes = Exclude<BreakfastTypes, BreakfastTypes.milkCerealBreakfast> | BreakfastMilkTypes;

export type AlimentationFootprintsMappingType = Record<
  Exclude<BreakfastWithMilkTypes, BreakfastTypes.noBreakfast> | MilkTypes | FoodTypes | BeverageTypes,
  string
>;

export type AlimentationDataFootprints = {
  [footprintKey in keyof typeof AlimentationFootprintsMapping | BreakfastTypes.noBreakfast]: number;
};

export type AlimentationDataMultipliers = {
  [multiplierKey in keyof typeof MultipliersMapping]: number | Record<string, number>;
};

export interface AlimentationData {
  quantities: AlimentationDataQuantities;
  footprints: AlimentationDataFootprints;
  multipliers: AlimentationDataMultipliers;
}
