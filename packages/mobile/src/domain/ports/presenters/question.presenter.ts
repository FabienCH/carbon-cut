export const BreakfastQuestionPresenterToken = Symbol.for('BreakfastQuestionPresenter');
export const HotBeveragesQuestionPresenterToken = Symbol.for('HotBeveragesQuestionPresenter');

interface BaseAnswer<T> {
  label: string;
  value: T;
}

export interface Answer<IdType extends string, AnswerType> extends BaseAnswer<AnswerType> {
  id: IdType;
  errorMessage?: string;
  placeholder?: string;
}

export interface SelectableAnswer<AnswerType> extends BaseAnswer<AnswerType> {
  selected: boolean;
}

export interface QuestionViewModel<IdType extends string, AnswerType> {
  question: string;
  answers: Answer<IdType, AnswerType | null>[];
  canSubmit: boolean;
}

export interface SelectableQuestionViewModel<AnswerType> {
  question: string;
  answers: SelectableAnswer<AnswerType>[];
  selectedAnswer: AnswerType | undefined;
  canSubmit: boolean;
}

export interface QuestionPresenter<AnswerType> {
  viewModel: QuestionViewModel<string, AnswerType> | SelectableQuestionViewModel<AnswerType>;
  setAnswer(answerValue: AnswerType | { id: string; value: AnswerType }): void;
}
