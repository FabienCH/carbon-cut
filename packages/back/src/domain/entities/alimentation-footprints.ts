export interface AlimentationFootprintData {
  footprintValue: number;
  quantityMultiplier?: number;
}

export class AlimentationFootprints {
  calculateFootprint(quantitiesPerWeek: number, alimentationFootprintDataKeys: AlimentationFootprintData): number {
    const { footprintValue, quantityMultiplier } = alimentationFootprintDataKeys;
    const footprint = footprintValue * (quantityMultiplier ?? 1);
    return quantitiesPerWeek * footprint;
  }

  calculateMultipleIngredientsFootprint(quantitiesPerWeek: number, alimentationFootprintDataKeys: AlimentationFootprintData[]): number {
    const ingredientsFootprint = alimentationFootprintDataKeys.reduce((footprintAcc, alimentationFootprintDataKey) => {
      const { footprintValue, quantityMultiplier } = alimentationFootprintDataKey;
      return (footprintAcc += footprintValue * (quantityMultiplier ?? 1));
    }, 0);

    return quantitiesPerWeek * ingredientsFootprint;
  }

  calculateAveragedFootprint(quantitiesPerWeek: number, footprintsValues: number[]): number {
    return quantitiesPerWeek * this.#averageFootprint(footprintsValues);
  }

  #averageFootprint(footprints: number[]): number {
    return footprints.reduce((average, footprint) => (average += footprint), 0) / footprints.length;
  }
}
