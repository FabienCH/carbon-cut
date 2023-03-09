import { injectable } from 'inversify';
import 'reflect-metadata';
import { WebInputNumberQuestionPresenter } from '../adapters/simulation/presenters/web-input-number-question.presenter';
import { PositiveNumberError } from '../domain/entites/answer-validator';
import { DefaultQuestionPresenterViewModel } from '../domain/ports/presenters/question.presenter';

@injectable()
export class FakeInputQuestionPresenter extends WebInputNumberQuestionPresenter<
  Record<string, number | undefined>,
  DefaultQuestionPresenterViewModel
> {
  protected _viewModel!: DefaultQuestionPresenterViewModel;
  answerValues!: Record<string, number | undefined>;

  setAnswer({ id, value }: { id: string; value: string | undefined }, __: PositiveNumberError): void {
    this.answerValues[id] = value === undefined ? undefined : parseFloat(value);
  }
}
