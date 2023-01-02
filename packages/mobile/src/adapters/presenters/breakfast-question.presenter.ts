import { Answer, QuestionPresenter } from '../../domain/ports/presenters/question.presneter';

export interface AnswerVM extends Answer {
  selected: boolean;
}

export class BreakfastQuestionPresenter implements QuestionPresenter {
  readonly question: string = 'Quel type de petit déjeuner prenez-vous habituellement ?';
  answers: AnswerVM[] = [
    { label: 'Viennoiserie / Pain', value: 'continental', selected: false },
    { label: 'Céréales avec lait ou yaourt', value: 'milkCereal', selected: false },
    { label: 'Salé (britannique)', value: 'british', selected: false },
    { label: 'Fruits', value: 'vegan', selected: false },
    { label: 'Pas de petits déjeuner', value: 'none', selected: false },
  ];

  setSelectedAnswer(answerValue: string): void {
    this.answers = this.answers.map((answer) => ({ ...answer, selected: answerValue === answer.value }));
  }
}
