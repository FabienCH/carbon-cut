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

export interface InputAnswer<IdType extends string> extends Answer<string | undefined> {
  id: IdType;
  errorMessage?: string;
  placeholder?: string;
}

export interface MultipleAnswersViewModel<T = InputAnswer<string> | Answer<unknown>> {
  answers: T[];
}

export interface AnswerViewModel<T = InputAnswer<string> | Answer<unknown>> {
  answer: T;
}

export type QuestionViewModel<T = AnswerViewModel<unknown> | MultipleAnswersViewModel<unknown>> = T & { question: string };

export type MultipleQuestionsViewModel<T = QuestionViewModel> = { questions: T[] };

export type QuestionPresenterViewModel<T = QuestionViewModel | MultipleQuestionsViewModel> = T & { canSubmit: boolean };

export interface QuestionPresenter<ViewModel = QuestionPresenterViewModel> {
  viewModel: ViewModel;
  onViewModelChanges(updateViewFn: (viewModel: ViewModel) => void): void;
}

export interface WithFormValidation<ViewModel = QuestionPresenterViewModel> {
  viewModel: ViewModel & { formError: string | null };
  updateFormError(formError: NumberEqualError): void;
}

export type InputAnswerValue<IdType> = { id: IdType; value: string | undefined };

export interface InputQuestionPresenter<AnswerValues extends Record<string, number | undefined>, ViewModel = QuestionPresenterViewModel>
  extends QuestionPresenter<ViewModel> {
  answerValues: Partial<AnswerValues>;
  setAnswer(answerValue: InputAnswerValue<keyof AnswerValues>, errors: PositiveNumberError, isValid: boolean, questionIndex?: number): void;
}

export interface SelectableQuestionPresenter<AnswerType = string, ViewModel = QuestionPresenterViewModel>
  extends QuestionPresenter<ViewModel> {
  selectedAnswer: AnswerType | undefined;
  setSelectedAnswer(answerValue: AnswerType, questionIndex?: number): void;
}
