export type PositiveNumberError = { error: 'isNotNumber' | 'isNotPositive' } | null;
export type NumberEqualError = { error: 'isNotEqual'; expected: number } | null;

export type AnswerValidatorsFn = (value: string | undefined) => PositiveNumberError;
export type FormValidatorsFn = (values: Array<number | string>) => NumberEqualError;

export class AnswerValidator {
  static positiveNumberValidator(value: string | undefined): PositiveNumberError {
    if (!value || isNaN(parseFloat(value))) {
      return { error: 'isNotNumber' };
    }
    const isPositiveNumber = value.match(/^[0-9]+.?[0-9]*$/);

    return isPositiveNumber ? null : { error: 'isNotPositive' };
  }

  static isNumberEqualValidator(values: Array<number | string>, validationValue: number): NumberEqualError {
    const totalValues = values.reduce((acc: number, value) => {
      if (typeof value === 'string') {
        return acc + parseFloat(value);
      }
      return acc + value;
    }, 0);

    return totalValues === validationValue ? null : { error: 'isNotEqual', expected: validationValue };
  }
}
