export class NumberFormatter {
  static roundNumber(number: number, precision: number): number {
    const precisionMultiplier = Math.pow(10, precision);
    return Math.round(number * precisionMultiplier) / precisionMultiplier;
  }
}
