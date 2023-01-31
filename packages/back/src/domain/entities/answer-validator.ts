import { getTypedObjectKeys } from 'carbon-cut-commons';
import { ValidationError } from './validation-error';

export class AnswerValidator {
  static validatePositiveValues<T extends Record<string, number>>(answer: T, answerName: string): void {
    const errors = getTypedObjectKeys(answer).reduce((errorsAcc: string[], answerKey) => {
      const value = answer[answerKey];
      if (value < 0) {
        errorsAcc.push(`${answerName}.${answerKey.toString()} must be positive, ${value} given`);
      }
      return errorsAcc;
    }, []);
    if (errors.length) {
      throw new ValidationError(errors);
    }
  }
}
