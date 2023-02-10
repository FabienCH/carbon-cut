import { injectable } from 'inversify';
import { AnswerValidatorsFn, FormValidatorsFn, NumberEqualError, PositiveNumberError } from '../entites/answer-validator';
import {
  InputAnswerValue,
  InputQuestionPresenter,
  QuestionPresenterViewModel,
  WithFormValidation,
} from '../ports/presenters/question.presenter';

export const SetInputAnswerUseCaseToken = Symbol.for('SetInputAnswerUseCase');

type PresenterWithOptionalFormValidation<T> = T | (T & WithFormValidation<QuestionPresenterViewModel>);

@injectable()
export class SetInputAnswerUseCase {
  execute(
    inputQuestionPresenter: PresenterWithOptionalFormValidation<InputQuestionPresenter<Record<string, number | undefined>>>,
    answerValue: InputAnswerValue<string>,
    { answerValidatorsFn, formValidatorsFn }: { answerValidatorsFn?: AnswerValidatorsFn[]; formValidatorsFn?: FormValidatorsFn[] },
    questionIndex?: number,
  ): void {
    const { answerValues } = inputQuestionPresenter;
    const updatedAnswersValues = this.#getUpdatedAnswersValues(answerValues, answerValue);
    const answerError = this.#getAnswerError(answerValue, answerValidatorsFn);
    const eachAnswerValid = this.#eachAnswerValid(updatedAnswersValues, answerValidatorsFn);
    const formError = this.#getFormError(updatedAnswersValues, formValidatorsFn);

    inputQuestionPresenter.setAnswer(answerValue, answerError, !!eachAnswerValid && !formError, questionIndex);
    if ('updateFormError' in inputQuestionPresenter) {
      inputQuestionPresenter.updateFormError(formError);
    }
  }

  #getUpdatedAnswersValues(answerValues: Record<string, number | undefined>, answerValue: InputAnswerValue<string>) {
    return Object.keys(answerValues).map((answerKey) => {
      if (answerKey === answerValue.id) {
        return answerValue.value;
      }
      return answerValues[answerKey]?.toString();
    });
  }

  #getAnswerError(answerValue: InputAnswerValue<string>, validators?: AnswerValidatorsFn[]): PositiveNumberError {
    if (!validators) {
      return null;
    }
    return validators.reduce((error: PositiveNumberError, validator) => {
      if (!error) {
        error = validator(answerValue.value);
      }
      return error;
    }, null);
  }

  #getFormError(allAnswersValues: Array<string | undefined>, validators?: FormValidatorsFn[]): NumberEqualError {
    const allAnswered = allAnswersValues.every((value) => value !== undefined);
    if (!validators || !allAnswered) {
      return null;
    }
    return validators.reduce((error: NumberEqualError, validator) => {
      if (!error) {
        error = validator(allAnswersValues as string[]);
      }
      return error;
    }, null);
  }

  #eachAnswerValid(allAnswersValues: Array<string | undefined>, validators?: AnswerValidatorsFn[]): boolean {
    if (!validators) {
      return true;
    }
    return allAnswersValues.every((value) => validators.every((validator) => validator(value) === null));
  }
}
