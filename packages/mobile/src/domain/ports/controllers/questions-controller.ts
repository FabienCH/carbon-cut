import { QuestionIds } from '@domain/entites/questions-navigation';

export const QuestionsControllerToken = Symbol.for('QuestionsController');

export interface QuestionsController {
  currentQuestion: QuestionIds;
  showNextQuestion: (questionId: QuestionIds) => void;
}
