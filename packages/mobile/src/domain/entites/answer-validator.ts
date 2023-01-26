export type PositiveNumberError = { error: 'isNotNumber' | 'isNotPositive' } | null;

export class AnswerValidator {
  static positiveNumberValidator(value: string | null): PositiveNumberError {
    if (!value || isNaN(parseFloat(value))) {
      return { error: 'isNotNumber' };
    }
    const isPositiveNumber = value.match(/^[0-9]+.?[0-9]*$/);

    return isPositiveNumber ? null : { error: 'isNotPositive' };
  }
}
