import { DataRecord, Formula } from './data-record';

enum QuantitiesMapping {
  coffeePerCup = 'alimentation . boisson . tasse de café . quantité café par tasse',
  teaPerCup = 'alimentation . boisson . tasse de thé . quantité thé par tasse',
}

type AlimentationQuantities = {
  [quantityKey in keyof typeof QuantitiesMapping]: number;
};

enum FootprintsMapping {
  groundedCoffee = 'alimentation . boisson . tasse de café . empreinte café moulu',
  infusedTea = 'alimentation . boisson . tasse de thé . empreinte thé infusé',
  teaHeatingPercent = 'alimentation . boisson . tasse de thé . part consommation empreinte thé infusé',
}

type AlimentationFootprints = {
  [footprintKey in keyof typeof FootprintsMapping]: number;
};

enum MultipliersMapping {
  localFoodReductionPercent = 'alimentation . local . niveau',
  localMealReductionPercent = 'alimentation . local . part locale',
}

type AlimentationMultipliers = {
  [multiplierKey in keyof typeof MultipliersMapping]: number;
};

export interface AlimentationData {
  quantities: AlimentationQuantities;
  footprints: AlimentationFootprints;
  multipliers: AlimentationMultipliers;
}

export class SimulationDataMapper {
  mapAlimentationData(alimentation: DataRecord): AlimentationData {
    return {
      quantities: this.mapObject(alimentation, QuantitiesMapping),
      footprints: this.mapObject(alimentation, FootprintsMapping),
      multipliers: this.mapObject(alimentation, MultipliersMapping),
    };
  }

  private mapObject<T>(
    alimentation: DataRecord,
    mappingObject: typeof QuantitiesMapping | typeof FootprintsMapping | typeof MultipliersMapping,
  ): T {
    return Object.keys(mappingObject).reduce((acc, key): T => {
      const alimentationKey = mappingObject[key as keyof typeof mappingObject];
      const formula = alimentation[alimentationKey]?.formule;
      if (typeof formula === 'number') {
        acc = { ...acc, [key]: formula };
      }

      const percentageFormula = this.getPercentageFormula(formula);
      if (percentageFormula) {
        acc = { ...acc, [key]: percentageFormula };
      }

      const variationPercentage = this.getVariationPercentage(formula);
      if (variationPercentage) {
        acc = { ...acc, [key]: variationPercentage };
      }

      const sommePercentage = this.getSommePercentage(formula);
      if (sommePercentage) {
        acc = { ...acc, [key]: sommePercentage };
      }

      return acc;
    }, {} as T);
  }

  private getPercentageFormula(formula: Formula): number {
    const percentageFormulaMatches = typeof formula === 'string' ? formula.match(/([0-9]{1,2}[,.]?[0-9]{0,2}|100)%/) : undefined;
    const percentageFormula = parseFloat(percentageFormulaMatches?.at(1));

    return this.roundPercentage(percentageFormula / 100);
  }

  private getVariationPercentage(formula: Formula): Record<string, number> {
    if (typeof formula === 'object' && 'variations' in formula) {
      const { variations } = formula;

      return variations.reduce((variationsAcc: Record<string, number>, variation) => {
        const variationKey = this.getVariationKey(variation.si);

        if (variationKey) {
          variationsAcc = { ...(variationsAcc ?? {}), [variationKey]: this.getPercentageFormula(variation.alors) };
        }
        return variationsAcc;
      }, undefined);
    }
  }

  private getSommePercentage(formula: Formula) {
    if (typeof formula === 'object' && 'somme' in formula) {
      const { somme } = formula;

      return somme.reduce((sommeAcc: Record<string, number>, sommeItem) => {
        const sommeKey = this.getLocalMealKey(sommeItem);
        const percentage = this.getPercentageFormula(sommeItem);

        if (sommeKey && !isNaN(percentage)) {
          sommeAcc = { ...(sommeAcc ?? {}), [sommeKey]: sommeKey === 'breakfast' ? this.roundPercentage(percentage / 7) : percentage };
        }
        return sommeAcc;
      }, undefined);
    }
  }

  private roundPercentage(percentageFormula: number) {
    return Math.round(percentageFormula * 1000) / 1000;
  }

  private getVariationKey(variationCase: string): string | void {
    if (variationCase.includes('toujours')) {
      return 'always';
    }

    if (variationCase.includes('souvent')) {
      return 'often';
    }

    if (variationCase.includes('parfois')) {
      return 'sometimes';
    }
  }

  private getLocalMealKey(somme: string): string | void {
    if (somme.includes('végétalien')) {
      return 'vegan';
    }

    if (somme.includes('végétarien')) {
      return 'vegetarian';
    }

    if (somme.includes('viande 1')) {
      return 'whiteMeat';
    }

    if (somme.includes('viande 2')) {
      return 'redMeat';
    }

    if (somme.includes('poisson 1')) {
      return 'fish';
    }

    if (somme.includes('poisson 2')) {
      return 'whiteFish';
    }

    if (somme.includes('petit déjeuner')) {
      return 'breakfast';
    }
  }
}
