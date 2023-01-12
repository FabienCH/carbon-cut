import { HotBeverages } from 'carbon-cut-commons';
import { injectable } from 'inversify';
import { Answer, QuestionPresenter, QuestionViewModel } from '../../domain/ports/presenters/question.presenter';

export type HotBeveragesKeys = keyof HotBeverages;

@injectable()
export class WebHotBeveragesQuestionPresenter implements QuestionPresenter<number | string> {
  readonly viewModel: QuestionViewModel<HotBeveragesKeys, number> = {
    question: 'Quelle est votre consommation de boissons chaudes par semaine ?',
    answers: [
      { id: 'coffee', label: 'Café', placeholder: 'Cafés / semaine', value: null },
      { id: 'tea', label: 'Thé', placeholder: 'Thés / semaine', value: null },
      { id: 'hotChocolate', label: 'Chocolat chaud', placeholder: 'Chocolat chaud / semaine', value: null },
    ],
    canSubmit: false,
  };

  setAnswer({ id, value }: { id: HotBeveragesKeys; value: string }): void {
    const isPositiveNumber = value?.match(/^[0-9]+$/);
    const intValue = parseInt(value, 10);

    this.viewModel.answers = this.viewModel.answers.map((answer) =>
      answer.id === id ? this.#updateAnswer(answer, intValue, !!isPositiveNumber) : answer,
    );
    this.viewModel.canSubmit = this.viewModel.answers.every((answer) => answer.value !== null);
  }

  simulationBeverages(): HotBeverages {
    return this.viewModel.answers.reduce((hotBeverages, answer) => {
      hotBeverages = { ...hotBeverages, [answer.id]: answer.value };
      return hotBeverages;
    }, {} as HotBeverages);
  }

  #updateAnswer(answer: Answer<HotBeveragesKeys, number | null>, value: number, isPositiveNumber: boolean) {
    if (isPositiveNumber) {
      return { ...answer, value, errorMessage: undefined };
    }

    return { ...answer, errorMessage: `Veuillez saisir un nombre${isNaN(value) ? '' : ' positif'}` };
  }
}
