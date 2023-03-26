import { QuestionIds } from '@domain/entites/questions-navigation';
import { QuestionsController } from '@domain/ports/controllers/questions-controller';

export class FakeQuestionsController implements QuestionsController {
  currentQuestion!: QuestionIds;

  showNextQuestion(question: QuestionIds) {
    this.currentQuestion = question;
  }
}
