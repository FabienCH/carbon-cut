import { CarAnswer, EngineType } from 'carbon-cut-commons';
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

export type CarAnswerKeys = keyof CarAnswer;
export type CarAnswerViewModel = QuestionPresenterViewModel<{
  engineTypeQuestion: QuestionViewModel<MultipleAnswersViewModel<Answer<EngineType>>>;
  kmQuestion: QuestionViewModel<AnswerViewModel<InputAnswer<'km'>>>;
}>;

@injectable()
export class WebCarKmTypeQuestionPresenter
  implements SelectableQuestionPresenter<EngineType, CarAnswerViewModel>, InputQuestionPresenter<{ km: number }, CarAnswerViewModel>
{
  selectedAnswer!: EngineType;
  #kmAnswerValid = false;

  get viewModel(): CarAnswerViewModel {
    return this._viewModel;
  }

  get answerValues(): { km: number } {
    return { km: this.#valueToNumber(this._viewModel.kmQuestion.answer.value) as number };
  }

  protected _viewModel: CarAnswerViewModel = {
    engineTypeQuestion: {
      question: 'Quel est le type de motorisation de votre voiture ?',
      answers: [
        { label: 'Thermique (diesel/essence)', value: EngineType.thermal },
        { label: 'Hybride', value: EngineType.hybrid },
        { label: 'Electrique', value: EngineType.electric },
      ],
    },
    kmQuestion: {
      question: "Combien de km parcourez-vous dans l'année ?",
      answer: { id: 'km', label: '', placeholder: 'km / an', value: undefined },
    },
    canSubmit: false,
  };

  #notifyChanges!: (viewModel: CarAnswerViewModel) => void;

  setAnswer({ value }: InputAnswerValue<'km'>, error: PositiveNumberError, isValid: boolean): void {
    const kmQuestionWihUpdatedAnswer = {
      ...this._viewModel.kmQuestion,
      answer: this.#updateAnswer(this._viewModel.kmQuestion.answer, value, error),
    };

    this.#kmAnswerValid = isValid;
    this.#updateViewModel({ kmQuestion: kmQuestionWihUpdatedAnswer, canSubmit: this.#kmAnswerValid && !!this.selectedAnswer });
  }

  setSelectedAnswer(answerValue: EngineType): void {
    this.selectedAnswer = answerValue;
    this._viewModel = { ...this._viewModel, canSubmit: this.#kmAnswerValid && !!this.selectedAnswer };
    this.#notifyChanges(this._viewModel);
  }

  onViewModelChanges(updateViewFn: (viewModel: CarAnswerViewModel) => void): void {
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

  #updateViewModel(viewModel: Partial<CarAnswerViewModel>) {
    this._viewModel = { ...this._viewModel, ...viewModel };
    this.#notifyChanges(this._viewModel);
  }

  #formatValue(value: string | undefined): string | undefined {
    return value?.replace(',', '.');
  }
}
