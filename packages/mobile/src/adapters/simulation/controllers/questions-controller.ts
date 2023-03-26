import { QuestionIds } from '@domain/entites/questions-navigation';
import { QuestionsController } from '@domain/ports/controllers/questions-controller';
import { navigate } from '@infrastructure/root-navigation';
import { injectable } from 'inversify';

export const QuestionsControllerToken = Symbol.for('QuestionsController');

@injectable()
export class RouterQuestionsController implements QuestionsController {
  currentQuestion!: QuestionIds;
  showNextQuestion(questionId: QuestionIds) {
    this.currentQuestion = questionId;
    navigate(questionId);
  }
}
