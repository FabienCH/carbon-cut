import { injectable } from 'inversify';
import { WebInputNumberQuestionPresenter } from '../adapters/simulation/presenters/web-input-number-question.presenter';
import { PositiveNumberError } from '../domain/entites/answer-validator';
import { QuestionPresenterViewModel } from '../domain/ports/presenters/question.presenter';

export type FakeViewModel = QuestionPresenterViewModel;

@injectable()
export class FakeInputQuestionPresenter extends WebInputNumberQuestionPresenter<
  Record<string, number | undefined>,
  QuestionPresenterViewModel
> {
  protected _viewModel!: QuestionPresenterViewModel;
  answerValues!: Record<string, number | undefined>;

  setAnswer({ id, value }: { id: string; value: string | undefined }, __: PositiveNumberError): void {
    this.answerValues[id] = value === undefined ? undefined : parseFloat(value);
  }
}
