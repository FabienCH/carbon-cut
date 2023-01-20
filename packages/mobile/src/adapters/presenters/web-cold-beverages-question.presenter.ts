import { ColdBeverages } from 'carbon-cut-commons';
import { injectable } from 'inversify';
import { Answer, QuestionPresenter, QuestionViewModel } from '../../domain/ports/presenters/question.presenter';

export type ColdBeveragesKeys = keyof ColdBeverages;

@injectable()
export class WebColdBeveragesQuestionPresenter implements QuestionPresenter<number | string> {
  readonly viewModel: QuestionViewModel<ColdBeveragesKeys, number> = {
    question: 'Quelle est votre consommation de boissons sucrée par semaine (sodas, jus de fruit, sirops)?',
    answers: [{ id: 'sweet', label: '', placeholder: 'litres / semaine', value: null }],
    canSubmit: false,
  };

  setAnswer({ key, value }: { key: ColdBeveragesKeys; value: string }): void {
    const isPositiveNumber = value?.match(/^[0-9]+.?[0-9]*$/);
    const intValue = parseFloat(value);
    this.viewModel.answers = this.viewModel.answers.map((answer) =>
      answer.id === key ? this.#updateAnswer(answer, intValue, !!isPositiveNumber) : answer,
    );
    this.viewModel.canSubmit = this.viewModel.answers.every((answer) => answer.value !== null);
  }

  simulationBeverages(): ColdBeverages {
    return this.viewModel.answers.reduce((coldBeverages, answer) => {
      coldBeverages = { ...coldBeverages, [answer.id]: answer.value as number };
      return coldBeverages;
    }, {} as ColdBeverages);
  }

  #updateAnswer(answer: Answer<ColdBeveragesKeys, number | null>, value: number, isPositiveNumber: boolean) {
    const updatedAnswer = isPositiveNumber
      ? { value, errorMessage: undefined }
      : { value: null, errorMessage: `Veuillez saisir un nombre${isNaN(value) ? '' : ' positif'}` };

    return { ...answer, ...updatedAnswer };
  }
}
