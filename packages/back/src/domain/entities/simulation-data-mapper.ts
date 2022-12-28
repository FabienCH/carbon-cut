import { DataRecord, Formula } from './data-record';

enum QuantitiesMapping {
  coffeePerCup = 'alimentation . boisson . tasse de café . quantité café par tasse',
  teaPerCup = 'alimentation . boisson . tasse de thé . quantité thé par tasse',
  cacaoPerCup = 'alimentation . boisson . tasse de chocolat chaud . quantité cacao par tasse',
  milkPerCup = 'alimentation . boisson . tasse de chocolat chaud . quantité lait par tasse',
}

type AlimentationQuantities = {
  [quantityKey in keyof typeof QuantitiesMapping]: number;
};

enum FootprintsMapping {
  groundedCoffee = 'alimentation . boisson . tasse de café . empreinte café moulu',
  infusedTea = 'alimentation . boisson . tasse de thé . empreinte thé infusé',
  cacaoPowder = 'alimentation . boisson . tasse de chocolat chaud . empreinte cacao en poudre',
  cowMilk = 'alimentation . empreinte lait de vache',
  sojaMilk = 'alimentation . empreinte lait de soja',
  oatsMilk = "alimentation . empreinte lait d'avoine",
  waterBottle = 'alimentation . boisson . eau en bouteille . empreinte',
  sodas = 'alimentation . boisson . sucrées . facteur sodas',
  fruitsJuice = 'alimentation . boisson . sucrées . facteur jus de fruits',
  sirops = 'alimentation . boisson . sucrées . facteur sirops',
  beer = 'alimentation . boisson . alcool . facteur bière',
  cocktail = 'alimentation . boisson . alcool . facteur coktail',
  veganMeal = 'alimentation . plats . végétalien . empreinte',
  vegetarianMeal = 'alimentation . plats . végétarien . empreinte',
  whiteMeatMeal = 'alimentation . plats . viande 1 . empreinte',
  redMeatMeal = 'alimentation . plats . viande 2 . empreinte',
  fishMeal = 'alimentation . plats . poisson 1 . empreinte',
  whiteFishMeal = 'alimentation . plats . poisson 2 . nombre',
  continentalBreakfast = 'alimentation . petit déjeuner . continental',
  cowMilkBreakfast = 'alimentation . petit déjeuner . lait vache céréales',
  sojaMilkBreakfast = 'alimentation . petit déjeuner . lait soja céréales',
  oatsMilkBreakfast = 'alimentation . petit déjeuner . lait avoine céréales',
  britishBreakfast = 'alimentation . petit déjeuner . britannique',
  veganBreakfast = 'alimentation . petit déjeuner . végétalien',
}

type AlimentationFootprints = {
  [footprintKey in keyof typeof FootprintsMapping]: number;
};

enum MultipliersMapping {
  localFoodReductionPercent = 'alimentation . local . niveau',
  localMealReductionPercent = 'alimentation . local . part locale',
  seasonMealReductionPercent = 'alimentation . de saison . niveau',
  seasonMealRatio = 'alimentation . de saison . niveau',
  seasonablePercent = 'alimentation . de saison . pourcentage saisonable',
  teaHeatingPercent = 'alimentation . boisson . tasse de thé . part consommation empreinte thé infusé',
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
          sommeAcc = { ...(sommeAcc ?? {}), [sommeKey]: percentage };
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
