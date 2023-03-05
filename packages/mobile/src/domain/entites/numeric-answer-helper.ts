export class NumericAnswerHelper {
  static valueToNumber(value: string | undefined): number | undefined {
    if (value === undefined) {
      return undefined;
    }
    return parseFloat(value);
  }

  static formatValue(value: string | undefined): string | undefined {
    return value?.replace(',', '.');
  }
}
