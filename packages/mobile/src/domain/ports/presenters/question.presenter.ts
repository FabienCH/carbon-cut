export const BreakfastQuestionPresenterToken = Symbol.for('BreakfastQuestionPresenter');
export const HotBeveragesQuestionPresenterToken = Symbol.for('HotBeveragesQuestionPresenter');
export const MilkTypeQuestionPresenterToken = Symbol.for('MilkTypeQuestionPresenter');
export const ColdBeveragesQuestionPresenterToken = Symbol.for('ColdBeveragesQuestionPresenter');

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
  questions: { question: string; answers: Answer<string, unknown | null>[] | SelectableAnswer<unknown>[] }[];
  canSubmit: boolean;
}
export interface QuestionViewModel<IdType extends string, AnswerType> extends BaseQuestionViewModel {
  questions: { question: string; answers: Answer<IdType, AnswerType | null>[] }[];
}

export interface SelectableQuestionViewModel<AnswerType> extends BaseQuestionViewModel {
  questions: { question: string; answers: SelectableAnswer<AnswerType>[] }[];
  selectedAnswer: AnswerType | undefined;
}

export interface QuestionPresenter<AnswerType> {
  viewModel: QuestionViewModel<string, AnswerType> | SelectableQuestionViewModel<AnswerType>;
  setAnswer(answerValue: AnswerType | { key: string; value: AnswerType }, questionIndex?: number): void;
}
