export interface AlimentationFootprintData {
  footprintValue: number;
  quantityMultiplier?: number;
}

export class AlimentationFootprints {
  calculateFootprint(quantitiesPerWeek: number, footprintDataValue: number, quantityDataMultiplier?: number): number {
    return this.#computeFootprint(quantitiesPerWeek, footprintDataValue, quantityDataMultiplier);
  }

  calculateMultipleIngredientsFootprint(quantitiesPerWeek: number, alimentationFootprintDataKeys: AlimentationFootprintData[]): number {
    return alimentationFootprintDataKeys.reduce((footprintAcc, alimentationFootprintDataKey) => {
      const { footprintValue, quantityMultiplier } = alimentationFootprintDataKey;
      return (footprintAcc += this.#computeFootprint(quantitiesPerWeek, footprintValue, quantityMultiplier));
    }, 0);
  }

  calculateAveragedFootprint(quantitiesPerWeek: number, footprintsValues: number[]): number {
    return quantitiesPerWeek * this.#averageFootprint(footprintsValues);
  }

  #computeFootprint(quantitiesPerWeek: number, footprintDataValue: number, quantityDataMultiplier: number | undefined) {
    const footprint = footprintDataValue * (quantityDataMultiplier ?? 1);
    return quantitiesPerWeek * footprint;
  }

  #averageFootprint(footprints: number[]): number {
    return footprints.reduce((average, footprint) => (average += footprint), 0) / footprints.length;
  }
}
