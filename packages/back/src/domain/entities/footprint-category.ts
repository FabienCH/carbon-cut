import { getTypedObjectKeys, NumberFormatter } from 'carbon-cut-commons';
import { AlimentationData, AlimentationDataFootprints, AlimentationDataQuantities } from '../types/alimentation-types';
import { FootprintHelper } from './footprints-helper';

export type WithoutTotal<T extends Record<string, number> & { total?: number }> = Omit<T, 'total'>;

export abstract class FootprintCategory<T extends Record<string, number> & { total?: number }> {
  protected readonly footprintsData: AlimentationDataFootprints;
  protected readonly quantitiesData: AlimentationDataQuantities;
  protected abstract readonly hasWeeklyFootprint: boolean;

  protected footprint: WithoutTotal<T>;

  constructor(alimentationData: AlimentationData) {
    this.footprintsData = alimentationData.footprints;
    this.quantitiesData = alimentationData.quantities;
  }

  protected calculateYearlyFootprintWithTotal(): WithoutTotal<T> & { total: number } {
    const footprints = this.getYearlyFootprints();
    const totalFootprints = this.#getTotal(footprints);

    return { ...footprints, total: totalFootprints };
  }

  protected getYearlyNonNullFootprint(footprint: WithoutTotal<T>): WithoutTotal<T> {
    const yearlyFootprint = getTypedObjectKeys(footprint).reduce((footprintAcc, footprintKey) => {
      const footprintValue = footprint[footprintKey];
      const dailyFootprint = this.hasWeeklyFootprint ? footprintValue / 7 : footprintValue;
      return { ...footprintAcc, [footprintKey]: FootprintHelper.getYearlyFootprint(dailyFootprint) };
    }, footprint);
    return yearlyFootprint;
  }

  #getTotal(object: Record<string, number | undefined | never>): number {
    if (!object) {
      return 0;
    }
    return NumberFormatter.roundNumber(
      Object.values(object).reduce((acc, val) => acc + val, 0),
      3,
    );
  }

  abstract calculateYearlyFootprint(): T;
  protected abstract getYearlyFootprints(): WithoutTotal<T>;
}
