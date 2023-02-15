import { FootprintHelper } from '../footprints-helper';

export interface AlimentationFootprintData {
  footprintValue: number;
  quantityMultiplier?: number;
}

export class AlimentationFootprints {
  calculateFootprint(quantitiesPerWeek: number, footprintDataValue: number, quantityDataMultiplier?: number): number {
    return this.#computeDailyFootprint(quantitiesPerWeek, footprintDataValue, quantityDataMultiplier);
  }

  calculateMultipleIngredientsFootprint(quantitiesPerWeek: number, alimentationFootprintDataKeys: AlimentationFootprintData[]): number {
    return alimentationFootprintDataKeys.reduce((footprintAcc, alimentationFootprintDataKey) => {
      const { footprintValue, quantityMultiplier } = alimentationFootprintDataKey;
      return (footprintAcc += this.#computeDailyFootprint(quantitiesPerWeek, footprintValue, quantityMultiplier));
    }, 0);
  }

  calculateAveragedFootprint(quantitiesPerWeek: number, footprintsValues: number[]): number {
    return this.#computeDailyFootprint(quantitiesPerWeek, this.#averageFootprint(footprintsValues));
  }

  #computeDailyFootprint(quantitiesPerWeek: number, footprintDataValue: number, quantityDataMultiplier?: number) {
    const footprint = footprintDataValue * (quantityDataMultiplier ?? 1);
    return FootprintHelper.getYearlyFootprint((quantitiesPerWeek / 7) * footprint);
  }

  #averageFootprint(footprints: number[]): number {
    return footprints.reduce((average, footprint) => (average += footprint), 0) / footprints.length;
  }
}
