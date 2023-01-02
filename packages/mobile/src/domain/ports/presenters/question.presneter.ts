export interface Answer {
  label: string;
  value: string;
}

export interface QuestionPresenter {
  question: string;
  answers: Answer[];
  setSelectedAnswer(answerValue: string): void;
}
