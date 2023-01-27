import { injectable } from 'inversify';
import { AnswerValidator } from '../entites/answer-validator';
import { InputAnswerValue, InputQuestionPresenter } from '../ports/presenters/question.presenter';

export const SetInputAnswerUseCaseToken = Symbol.for('SetInputAnswerUseCase');

@injectable()
export class SetInputAnswerUseCase {
  execute(
    inputQuestionPresenter: InputQuestionPresenter<Record<string, number | undefined>>,
    answerValue: InputAnswerValue<string>,
    questionIndex?: number,
  ): void {
    const answerError = AnswerValidator.positiveNumberValidator(answerValue.value);
    const canSubmit = Object.keys(inputQuestionPresenter.answerValues).every((answerKey) => {
      if (answerKey === answerValue.id) {
        return answerError === null;
      }
      const value = inputQuestionPresenter.answerValues[answerKey]?.toString();
      return AnswerValidator.positiveNumberValidator(value) === null;
    });
    inputQuestionPresenter.setAnswer(answerValue, answerError, canSubmit, questionIndex);
  }
}
