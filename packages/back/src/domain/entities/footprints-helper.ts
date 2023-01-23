import { getTypedObjectKeys, NumberFormatter } from 'carbon-cut-commons';

export class FootprintHelper {
  static removeNullOrZeroValues<T extends object>(object: T): Partial<T> {
    return getTypedObjectKeys(object).reduce((partialObject: Partial<T>, key) => {
      const value = object[key];
      if (value) {
        partialObject = { ...(partialObject ?? {}), [key]: value };
      }
      return partialObject;
    }, undefined);
  }

  static getTotalFromObject(object: Record<string, number>): number {
    if (!object) {
      return 0;
    }
    return NumberFormatter.roundNumber(
      Object.values(object).reduce((acc, val) => acc + val, 0),
      3,
    );
  }

  static getYearlyFootprint(dailyFootprint: number): number {
    return NumberFormatter.roundNumber(dailyFootprint * 365, 3);
  }
}
