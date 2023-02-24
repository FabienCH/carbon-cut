import { NumberEqualError, PositiveNumberError } from '../../entites/answer-validator';

export const BreakfastQuestionPresenterToken = Symbol.for('BreakfastQuestionPresenter');
export const HotBeveragesQuestionPresenterToken = Symbol.for('HotBeveragesQuestionPresenter');
export const MilkTypeQuestionPresenterToken = Symbol.for('MilkTypeQuestionPresenter');
export const ColdBeveragesQuestionPresenterToken = Symbol.for('ColdBeveragesQuestionPresenter');
export const MealsQuestionPresenterToken = Symbol.for('MealsQuestionPresenter');
export const CarKmTypeQuestionPresenterToken = Symbol.for('CarKmTypeQuestionPresenter');
export const FuelCarConsumptionQuestionPresenterToken = Symbol.for('FuelCarConsumptionQuestionPresenter');

export interface Answer<T> {
  label: string;
  value: T;
}

export interface InputAnswer<AnswerId extends string> extends Answer<string | undefined> {
  id: AnswerId;
  errorMessage?: string;
  placeholder?: string;
}

type DefaultAnswer = InputAnswer<string> | Answer<unknown>;

export interface MultipleAnswersViewModel<T extends DefaultAnswer> {
  answers: T[];
}

export interface AnswerViewModel<T extends DefaultAnswer> {
  answer: T;
}

type DefaultAnswersViewModel = AnswerViewModel<DefaultAnswer> | MultipleAnswersViewModel<DefaultAnswer>;

export type QuestionViewModel<T extends DefaultAnswersViewModel> = T & {
  question: string;
};

type DefaultQuestionViewModel = QuestionViewModel<DefaultAnswersViewModel>;

export type MultipleQuestionsViewModel<T extends DefaultQuestionViewModel[] | { [key: string]: DefaultQuestionViewModel }> = {
  questions: T;
};

export type RecordQuestionViewModel = Omit<{ [key: string]: DefaultQuestionViewModel }, 'canSubmit'>;

export type QuestionPresenterViewModel<
  T extends DefaultQuestionViewModel | MultipleQuestionsViewModel<DefaultQuestionViewModel[] | { [key: string]: DefaultQuestionViewModel }>,
> = T & {
  canSubmit: boolean;
};

export type DefaultQuestionPresenterViewModel = QuestionPresenterViewModel<
  DefaultQuestionViewModel | MultipleQuestionsViewModel<DefaultQuestionViewModel[] | { [key: string]: DefaultQuestionViewModel }>
>;

export interface QuestionPresenter<ViewModel extends DefaultQuestionPresenterViewModel> {
  viewModel: ViewModel;
  onViewModelChanges(updateViewFn: (viewModel: ViewModel) => void): void;
}

export interface WithFormValidation<ViewModel extends DefaultQuestionPresenterViewModel> {
  viewModel: ViewModel & { formError: string | null };
  updateFormError(formError: NumberEqualError): void;
}

export type InputAnswerValue<IdType> = { id: IdType; value: string | undefined };

export interface InputQuestionPresenter<
  AnswerValues extends Record<string, number | undefined>,
  ViewModel extends DefaultQuestionPresenterViewModel,
> extends QuestionPresenter<ViewModel> {
  answerValues: Partial<AnswerValues>;
  setAnswer(answerValue: InputAnswerValue<keyof AnswerValues>, errors: PositiveNumberError, isValid: boolean, questionIndex?: number): void;
}

export interface SelectableQuestionPresenter<AnswerType extends string, ViewModel extends DefaultQuestionPresenterViewModel>
  extends QuestionPresenter<ViewModel> {
  selectedAnswer: AnswerType | undefined;
  setSelectedAnswer(answerValue: AnswerType, questionIndex?: number): void;
}
