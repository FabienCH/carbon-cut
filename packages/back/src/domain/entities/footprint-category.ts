import {
  ColdBeveragesAnswer,
  ColdBeveragesFootprints,
  getTypedObjectKeys,
  HotBeveragesAnswer,
  HotBeveragesFootprints,
  MealsAnswer,
  MealsFootprints,
} from 'carbon-cut-commons';
import { AlimentationData, AlimentationDataFootprints, AlimentationDataQuantities } from '../types/alimentation-types';
import { FootprintHelper } from './footprints-helper';

export abstract class FootprintCategory {
  protected readonly footprintsData: AlimentationDataFootprints;
  protected readonly quantitiesData: AlimentationDataQuantities;
  protected abstract readonly hasWeeklyFootprint: boolean;

  constructor(alimentationData: AlimentationData) {
    this.footprintsData = alimentationData.footprints;
    this.quantitiesData = alimentationData.quantities;
  }

  calculateYearlyFootprint(): ColdBeveragesFootprints | HotBeveragesFootprints | MealsFootprints {
    const footprints = this.getYearlyFootprints();
    const totalFootprints = FootprintHelper.getTotalFromObject(footprints);
    return FootprintHelper.removeNullOrZeroValues({ ...footprints, total: totalFootprints });
  }

  protected getYearlyNonNullFootprint(
    footprint: ColdBeveragesAnswer | HotBeveragesAnswer | MealsAnswer,
  ): Partial<ColdBeveragesFootprints | HotBeveragesFootprints | MealsFootprints> {
    const yearlyFootprint = getTypedObjectKeys(footprint).reduce((footprintAcc, footprintKey) => {
      const dailyFootprint = this.hasWeeklyFootprint ? footprint[footprintKey] / 7 : footprint[footprintKey];
      return { ...footprintAcc, [footprintKey]: FootprintHelper.getYearlyFootprint(dailyFootprint) };
    }, footprint);
    return FootprintHelper.removeNullOrZeroValues(yearlyFootprint);
  }

  protected abstract getYearlyFootprints(): Partial<ColdBeveragesFootprints | HotBeveragesFootprints | MealsFootprints>;
}
