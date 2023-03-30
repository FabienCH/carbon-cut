import { QuestionIds } from '@domain/entites/questions-navigation';

export const QuestionsControllerToken = Symbol.for('QuestionsController');

export interface QuestionsController {
  showNextQuestion: (questionId: QuestionIds) => void;
}
