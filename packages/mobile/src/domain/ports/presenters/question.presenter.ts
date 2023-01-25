export const BreakfastQuestionPresenterToken = Symbol.for('BreakfastQuestionPresenter');
export const HotBeveragesQuestionPresenterToken = Symbol.for('HotBeveragesQuestionPresenter');
export const MilkTypeQuestionPresenterToken = Symbol.for('MilkTypeQuestionPresenter');
export const ColdBeveragesQuestionPresenterToken = Symbol.for('ColdBeveragesQuestionPresenter');

export interface Answer<T> {
  label: string;
  value: T;
}

export interface InputAnswer<IdType extends string, AnswerType> extends Answer<AnswerType> {
  id: IdType;
  errorMessage?: string;
  placeholder?: string;
}

export interface MultipleAnswersViewModel<T = InputAnswer<string, unknown | null>[] | Answer<unknown>[]> {
  answers: T;
}

export interface AnswerViewModel<T = InputAnswer<string, unknown | null> | Answer<unknown>> {
  answer: T;
}

export type QuestionViewModel<T = AnswerViewModel<unknown> | MultipleAnswersViewModel<unknown>> = T & { question: string };

export type MultipleQuestionsViewModel<T = QuestionViewModel> = { questions: T[] };

export type QuestionPresenterViewModel<T = QuestionViewModel | MultipleQuestionsViewModel> = T & { canSubmit: boolean };

// export interface InputQuestionViewModel<IdType extends string, AnswerType> extends BaseQuestionViewModel {
//   questions: { question: string; answers: InputAnswer<IdType, AnswerType | null>[] }[];
// }

// export interface SelectableQuestionViewModel<AnswerType> extends BaseQuestionViewModel {
//   questions: { question: string; answers: SelectableAnswer<AnswerType>[] }[];
//   selectedAnswer: AnswerType | undefined;
// }

export type ExclusiveUnion<A, B> = (Omit<A, keyof B> | A) | Omit<B, keyof A>;

export interface QuestionPresenter<AnswerType> {
  viewModel: QuestionPresenterViewModel;
  onViewModelChanges(updateViewFn: (viewModel: QuestionPresenterViewModel) => void): void;
  setAnswer(answerValue: AnswerType | null | { key: string; value: AnswerType | null }, questionIndex?: number): void;
}

export interface InputQuestionPresenter<AnswerType, AnswerValues> extends QuestionPresenter<AnswerType> {
  answerValues: AnswerValues;
  setAnswer(answerValue: ExclusiveUnion<AnswerType | null, { key: string; value: AnswerType | null }>, questionIndex?: number): void;
}

export interface SelectableQuestionPresenter<AnswerType> extends QuestionPresenter<AnswerType> {
  selectedAnswer: AnswerType | undefined;
  setAnswer(answerValue: AnswerType, questionIndex?: number): void;
}
