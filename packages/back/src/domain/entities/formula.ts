import { getTypedObjectKeys, NumberFormatter } from 'carbon-cut-commons';

interface IfVariation {
  si: string;
  alors: string | number;
}

interface ElseVariation {
  sinon: string | number;
}

type Variations = IfVariation | ElseVariation;

enum VariationIfKeys {
  toujours = 'always',
  souvent = 'often',
  parfois = 'sometimes',
  "carburant = 'gazole B7 ou B10'" = 'carDieselByLiter',
  "carburant = 'essence E5 ou E10" = 'carEssenceE10ByLiter',
  "carburant = 'essence E85'" = 'carEssenceE85ByLiter',
  "motorisation = 'hybride'" = 'carHybridReduction',
  "gabarit = 'petite'" = 'smallElectricalCarByKm',
  "gabarit = 'moyenne'" = 'mediumElectricalCarByKm',
}

enum VariationElseDatasourceKeys {
  'transport . voiture . électrique . empreinte au kilomètre' = 'largeElectricalCarByKm',
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

export type FormulaValue = number | string | { variations: Variations[] } | { somme: string[] } | object;

export class Formula {
  constructor(private value: FormulaValue) {}

  getMappedValue(key: string) {
    if (typeof this.value === 'number') {
      return { [key]: this.value };
    }

    const percentage = this.#getPercentageFromString(this.value);
    if (percentage) {
      return { [key]: percentage };
    }

    const objectValues = this.#getObjectValues();
    if (objectValues) {
      return { [key]: this.#getPercentagesFromObject(objectValues) };
    }
  }

  getMappedTransportValue(dataSourceKey: string) {
    const objectValues = this.#getObjectValues();
    if (objectValues) {
      return { ...this.#getObjectFromVariations(objectValues, dataSourceKey) };
    }
  }

  #getPercentageFromString(formulaValue: FormulaValue): number {
    const percentageFormulaMatches = typeof formulaValue === 'string' ? formulaValue.match(/([0-9]{1,2}[,.]?[0-9]{0,2}|100)%/) : undefined;
    const percentageFormula = parseFloat(percentageFormulaMatches?.at(1));

    return NumberFormatter.roundNumber(percentageFormula / 100, 3);
  }

  #getPercentagesFromObject(objectValues: Array<Variations | string>): Record<string, number> {
    return objectValues.reduce((acc: Record<string, number>, value) => {
      if (typeof value !== 'string' && 'sinon' in value) {
        return acc;
      }
      const key = this.#getKey(value);
      const percentage = this.#getPercentage(value);

      if (key && !isNaN(percentage)) {
        acc = { ...(acc ?? {}), [key]: percentage };
      }
      return acc;
    }, undefined);
  }

  #getObjectFromVariations(objectValues: Array<Variations | string>, dataSourceKey: string): Record<string, number> {
    return objectValues.reduce((acc: Record<string, number>, value) => {
      if (typeof value === 'string') {
        return acc;
      }
      const key = this.#getKey(value, dataSourceKey);
      const dataValue = this.#formVariationsValue(value);
      if (key && dataValue && !isNaN(dataValue)) {
        acc = { ...(acc ?? {}), [key]: dataValue };
      }

      return acc;
    }, undefined);
  }

  #formVariationsValue(value: Variations): number | void {
    if ('si' in value) {
      return this.#formIsVariationValue(value);
    }
    return this.#formElseVariationValue(value);
  }

  #formIsVariationValue(value: IfVariation): number | void {
    if (typeof value.alors === 'string') {
      // Ex: this regexp captures 3.1 + 3.04 in (3.1 + 3.04) / 2
      const matchSumToAverage = value.alors.match(/\(([0-9]+.?[0-9]*(?: \+ [0-9]+.?[0-9]*)+)\)/);
      if (matchSumToAverage) {
        return this.#mapAverage(matchSumToAverage[1]);
      }
      // Ex: this regexp captures 0.85 in thermique . empreinte au kilomètre * 0.85
      const matchExpressionWithMultiplier = value.alors.match(/^(?:\D)*\* *([0-9]+.?[0-9]*)$/);
      if (matchExpressionWithMultiplier) {
        return parseFloat(matchExpressionWithMultiplier[1]);
      }
      return parseFloat(matchExpressionWithMultiplier ? matchExpressionWithMultiplier[1] : value.alors);
    }
    return value.alors;
  }

  #formElseVariationValue(value: ElseVariation): number | void {
    return typeof value.sinon === 'string' ? parseFloat(value.sinon) : value.sinon;
  }

  #getObjectValues(): Array<Variations | string> {
    if (typeof this.value === 'object') {
      if ('variations' in this.value) {
        return this.value.variations;
      }
      if ('somme' in this.value) {
        return this.value.somme;
      }
    }
  }

  #mapAverage(sumToAverage: string): number {
    const numbersToAverage = sumToAverage
      .replace(/ /g, '')
      .split('+')
      .map((strNumber) => parseFloat(strNumber));
    const average = numbersToAverage.reduce((average, number) => (average += number), 0) / numbersToAverage.length;
    return NumberFormatter.roundNumber(average, 3);
  }

  #getKey(formulaValue: string | Variations, dataSourceKey?: string): string | void {
    if (typeof formulaValue === 'string') {
      return this.#getKeyFromString(formulaValue, SumKeys);
    }
    if ('sinon' in formulaValue) {
      return this.#getKeyFromString(dataSourceKey, VariationElseDatasourceKeys);
    }
    return this.#getKeyFromString(formulaValue.si, VariationIfKeys);
  }

  #getPercentage(formulaValue: string | IfVariation): number {
    const value = typeof formulaValue === 'string' ? formulaValue : formulaValue.alors;
    return this.#getPercentageFromString(value);
  }

  #getKeyFromString(sourceKey: string, keys: typeof VariationIfKeys | typeof SumKeys | typeof VariationElseDatasourceKeys): string | void {
    const key = getTypedObjectKeys(keys).find((variationKey) => sourceKey.includes(variationKey));

    return keys[key];
  }
}
