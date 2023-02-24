import { FuelType } from 'carbon-cut-commons';
import { injectable } from 'inversify';
import { PositiveNumberError } from '../../../../domain/entites/answer-validator';
import {
  Answer,
  AnswerViewModel,
  InputAnswer,
  InputAnswerValue,
  InputQuestionPresenter,
  MultipleAnswersViewModel,
  QuestionPresenterViewModel,
  QuestionViewModel,
  SelectableQuestionPresenter,
} from '../../../../domain/ports/presenters/question.presenter';

export type FuelCarConsumptionAnswerViewModel = QuestionPresenterViewModel<{
  fuelTypeQuestion: QuestionViewModel<MultipleAnswersViewModel<Answer<FuelType>>>;
  fuelConsumptionQuestion: QuestionViewModel<AnswerViewModel<InputAnswer<'fuelConsumption'>>>;
}>;

@injectable()
export class WebFuelCarConsumptionQuestionPresenter
  implements
    SelectableQuestionPresenter<FuelType, FuelCarConsumptionAnswerViewModel>,
    InputQuestionPresenter<{ fuelConsumption: number }, FuelCarConsumptionAnswerViewModel>
{
  selectedAnswer!: FuelType;
  #kmAnswerValid = false;

  get viewModel(): FuelCarConsumptionAnswerViewModel {
    return this._viewModel;
  }

  get answerValues(): { fuelConsumption: number } {
    return { fuelConsumption: this.#valueToNumber(this._viewModel.fuelConsumptionQuestion.answer.value) as number };
  }

  protected _viewModel: FuelCarConsumptionAnswerViewModel = {
    fuelTypeQuestion: {
      question: 'Quel type de carburant votre voiture consomme-t-elle ?',
      answers: [
        { label: 'Diesel', value: FuelType.diesel },
        { label: 'Essence E10', value: FuelType.essenceE10 },
        { label: 'Essence E85', value: FuelType.essenceE85 },
      ],
    },
    fuelConsumptionQuestion: {
      question: 'Combien de litre votre voiture consomme-t-elle pour 100 km ?',
      answer: { id: 'fuelConsumption', label: '', placeholder: 'l / 100 km', value: undefined },
    },
    canSubmit: false,
  };

  #notifyChanges!: (viewModel: FuelCarConsumptionAnswerViewModel) => void;

  setAnswer({ value }: InputAnswerValue<'fuelConsumption'>, error: PositiveNumberError, isValid: boolean): void {
    const updatedFuelConsumptionQuestion = {
      ...this._viewModel.fuelConsumptionQuestion,
      answer: this.#updateAnswer(this._viewModel.fuelConsumptionQuestion.answer, value, error),
    };

    this.#kmAnswerValid = isValid;
    this.#updateViewModel({
      fuelConsumptionQuestion: updatedFuelConsumptionQuestion,
      canSubmit: this.#kmAnswerValid && !!this.selectedAnswer,
    });
  }

  setSelectedAnswer(answerValue: FuelType): void {
    this.selectedAnswer = answerValue;
    this._viewModel = { ...this._viewModel, canSubmit: this.#kmAnswerValid && !!this.selectedAnswer };
    this.#notifyChanges(this._viewModel);
  }

  onViewModelChanges(updateViewFn: (viewModel: FuelCarConsumptionAnswerViewModel) => void): void {
    this.#notifyChanges = updateViewFn;
  }

  #valueToNumber(value: string | undefined): number | undefined {
    if (value === undefined) {
      return undefined;
    }
    return parseFloat(value);
  }

  #updateAnswer<InputKey extends string>(answer: InputAnswer<InputKey>, value: string | undefined, answerError: PositiveNumberError) {
    const errorMessage = answerError ? `Veuillez saisir un nombre${answerError.error === 'isNotPositive' ? ' positif' : ''}` : undefined;

    return { ...answer, value: this.#formatValue(value), errorMessage };
  }

  #updateViewModel(viewModel: Partial<FuelCarConsumptionAnswerViewModel>) {
    this._viewModel = { ...this._viewModel, ...viewModel };
    this.#notifyChanges(this._viewModel);
  }

  #formatValue(value: string | undefined): string | undefined {
    return value?.replace(',', '.');
  }
}
