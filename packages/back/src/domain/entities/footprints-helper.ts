import { getTypedObjectKeys, NumberFormatter } from 'carbon-cut-commons';

export class FootprintHelper {
  static removeNullishFootprints<T extends Record<string, unknown>>(object: T): Partial<T> {
    return getTypedObjectKeys(object).reduce((partialObject: Partial<T>, key) => {
      const value = object[key];
      if (value) {
        const currentObject = partialObject ?? ({} as Partial<T>);
        partialObject = { ...currentObject, [key]: value };
      }
      return partialObject;
    }, undefined);
  }

  static getYearlyFootprint(dailyFootprint: number): number {
    return NumberFormatter.roundNumber(dailyFootprint * 365, 3);
  }
}
