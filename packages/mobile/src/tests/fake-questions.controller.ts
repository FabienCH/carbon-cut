import { QuestionIds } from '@domain/entites/questions-navigation';
import { QuestionsController } from '@domain/ports/controllers/questions-controller';

export class FakeQuestionsController implements QuestionsController {
  showNextQuestion(_: QuestionIds) {}
}
