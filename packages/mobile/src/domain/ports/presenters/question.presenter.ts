export const BreakfastQuestionPresenterToken = Symbol.for('BreakfastQuestionPresenter');

export interface Answer<T> {
  label: string;
  value: T;
  selected: boolean;
}

export interface QuestionViewModel<T> {
  question: string;
  answers: Answer<T>[];
  selectedAnswer: T | null;
  canSubmit: boolean;
}

export interface QuestionPresenter<T> {
  viewModel: QuestionViewModel<T>;
  setSelectedAnswer(answerValue: T): void;
}
