import { NumberFormatter } from 'carbon-cut-commons';

interface Variation {
  si: string;
  alors: string;
}

enum VariationKeys {
  toujours = 'always',
  souvent = 'often',
  parfois = 'sometimes',
}

enum SumKeys {
  végétalien = 'vegan',
  végétarien = 'vegetarian',
  'viande 1' = 'whiteMeat',
  'viande 2' = 'redMeat',
  'poisson 1' = 'fish',
  'poisson 2' = 'whiteFish',
  'petit déjeuner' = 'breakfast',
}

export type FormulaValue = number | string | { variations: Variation[] } | { somme: string[] } | object;

export class Formula {
  constructor(private value: FormulaValue) {}

  getMappedValue(key: string) {
    if (typeof this.value === 'number') {
      return { [key]: this.value };
    }

    const percentage = this.getPercentageFromString(this.value);
    if (percentage) {
      return { [key]: percentage };
    }

    const percentages = this.getPercentagesFromObject();
    if (percentages) {
      return { [key]: percentages };
    }
  }

  private getPercentageFromString(formulaValue: FormulaValue): number {
    const percentageFormulaMatches = typeof formulaValue === 'string' ? formulaValue.match(/([0-9]{1,2}[,.]?[0-9]{0,2}|100)%/) : undefined;
    const percentageFormula = parseFloat(percentageFormulaMatches?.at(1));

    return NumberFormatter.roundNumber(percentageFormula / 100, 3);
  }

  private getPercentagesFromObject(): Record<string, number> {
    const objectValues = this.getObjectValues();
    if (objectValues) {
      return objectValues.reduce((acc: Record<string, number>, value) => {
        const key = this.getKey(value);
        const percentage = this.getPercentage(value);

        if (key && !isNaN(percentage)) {
          acc = { ...(acc ?? {}), [key]: percentage };
        }
        return acc;
      }, undefined);
    }
  }

  private getObjectValues(): readonly (Variation | string)[] {
    if (typeof this.value === 'object') {
      if ('variations' in this.value) {
        return this.value.variations;
      }
      if ('somme' in this.value) {
        return this.value.somme;
      }
    }
  }

  private getKey(formulaValue: string | Variation): string | void {
    return typeof formulaValue === 'string'
      ? this.getKeyFromString(formulaValue, SumKeys)
      : this.getKeyFromString(formulaValue.si, VariationKeys);
  }

  private getPercentage(formulaValue: string | Variation): number {
    const value = typeof formulaValue === 'string' ? formulaValue : formulaValue.alors;
    return this.getPercentageFromString(value);
  }

  private getKeyFromString(sourceKey: string, keys: typeof VariationKeys | typeof SumKeys): string | void {
    const key = Object.keys(keys).find((variationKey) => sourceKey.includes(variationKey)) as keyof typeof keys;

    return keys[key];
  }
}
