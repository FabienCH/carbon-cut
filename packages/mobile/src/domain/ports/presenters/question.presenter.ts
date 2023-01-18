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

interface BaseQuestionViewModel {
  question: string;
  canSubmit: boolean;
}
export interface QuestionViewModel<IdType extends string, AnswerType> extends BaseQuestionViewModel {
  answers: Answer<IdType, AnswerType | null>[];
}

export interface SelectableQuestionViewModel<AnswerType> extends BaseQuestionViewModel {
  answers: SelectableAnswer<AnswerType>[];
  selectedAnswer: AnswerType | undefined;
}

export interface QuestionPresenter<AnswerType> {
  viewModel: QuestionViewModel<string, AnswerType> | SelectableQuestionViewModel<AnswerType>;
  setAnswer(answerValue: AnswerType | { id: string; value: AnswerType }): void;
}
