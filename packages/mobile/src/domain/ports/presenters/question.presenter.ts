export const BreakfastQuestionPresenterToken = Symbol.for('BreakfastQuestionPresenter');
export const HotBeveragesQuestionPresenterToken = Symbol.for('HotBeveragesQuestionPresenter');

export interface Answer<T> {
  label: string;
  value: T;
}

export interface SelectableAnswer<AnswerType> extends Answer<AnswerType> {
  selected: boolean;
}

export interface QuestionViewModel<AnswerType, AnswersKeys extends string> {
  question: string;
  answers: Record<AnswersKeys, Answer<AnswerType | null>>;
  canSubmit: boolean;
}

export interface SelectableQuestionViewModel<AnswerType> {
  question: string;
  answers: SelectableAnswer<AnswerType>[];
  selectedAnswer: AnswerType | undefined;
  canSubmit: boolean;
}

export interface QuestionPresenter<AnswerType> {
  viewModel: QuestionViewModel<AnswerType, string> | SelectableQuestionViewModel<AnswerType>;
  setAnswer(answerValue: AnswerType | { key: string; value: AnswerType }): void;
}
