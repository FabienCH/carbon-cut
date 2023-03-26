import { QuestionIds } from '@domain/entites/questions-navigation';
import { QuestionsController } from '@domain/ports/controllers/questions-controller';
import { SimulationStore, SimulationStoreToken } from '@domain/ports/stores/simulation-store';
import { SaveSimulationAnswerUseCase } from '@domain/usecases/save-simulation-answer.usecase';
import { diContainer } from '@infrastructure/inversify.config';
import { FakeQuestionsController } from '@tests/fake-questions.controller';
import { BreakfastTypes, CarSize, EngineType } from 'carbon-cut-commons';

describe('Save simulation answer use case', () => {
  let simulationStore: SimulationStore;
  let saveSimulationAnswerUseCase: SaveSimulationAnswerUseCase;
  let questionsController: QuestionsController;
  let showNextQuestionSpy: jest.SpyInstance;

  beforeEach(() => {
    simulationStore = diContainer.get(SimulationStoreToken);
    questionsController = new FakeQuestionsController();
    saveSimulationAnswerUseCase = new SaveSimulationAnswerUseCase(simulationStore, questionsController);
    showNextQuestionSpy = jest.spyOn(questionsController, 'showNextQuestion');
  });

  describe('Saving an answer', () => {
    it('should save an simple answer to store', () => {
      saveSimulationAnswerUseCase.execute({ breakfast: BreakfastTypes.britishBreakfast });

      const simulationAnswers = simulationStore.getSimulationsAnswers();
      expect(simulationAnswers?.alimentation.breakfast).toEqual(BreakfastTypes.britishBreakfast);
    });

    it('should save multiple answers to store', () => {
      saveSimulationAnswerUseCase.execute({ carUsage: { km: 5000, engineType: EngineType.thermal } });

      const simulationAnswers = simulationStore.getSimulationsAnswers();
      expect(simulationAnswers?.transport.carUsage).toEqual({ km: 5000, engineType: EngineType.thermal });
    });

    describe('Next question should', () => {
      it('be hot beverage after breakfast', () => {
        questionsController.currentQuestion = QuestionIds.Breakfast;

        saveSimulationAnswerUseCase.execute({ breakfast: BreakfastTypes.britishBreakfast });

        expect(showNextQuestionSpy).toHaveBeenCalledWith(QuestionIds.HotBeverages);
      });

      it('be milk type after hot beverages if breakfast has milk', () => {
        questionsController.currentQuestion = QuestionIds.HotBeverages;
        simulationStore.saveAnswer({ breakfast: BreakfastTypes.milkCerealBreakfast });

        saveSimulationAnswerUseCase.execute({ hotBeverages: { coffee: 5, tea: 2, hotChocolate: 0 } });

        expect(showNextQuestionSpy).toHaveBeenCalledWith(QuestionIds.MilkType);
      });

      it('be milk type after hot beverages if hot beverages has milk', () => {
        questionsController.currentQuestion = QuestionIds.HotBeverages;
        simulationStore.saveAnswer({ breakfast: BreakfastTypes.britishBreakfast });

        saveSimulationAnswerUseCase.execute({ hotBeverages: { coffee: 5, tea: 2, hotChocolate: 1 } });

        expect(showNextQuestionSpy).toHaveBeenCalledWith(QuestionIds.MilkType);
      });

      it('skip milk type and show cold beverage after hot beverages if previous answers has no milk', () => {
        questionsController.currentQuestion = QuestionIds.HotBeverages;
        simulationStore.saveAnswer({ breakfast: BreakfastTypes.britishBreakfast });

        saveSimulationAnswerUseCase.execute({ hotBeverages: { coffee: 5, tea: 2, hotChocolate: 0 } });

        expect(showNextQuestionSpy).toHaveBeenCalledWith(QuestionIds.ColdBeverages);
      });

      it('be car km type after meals', () => {
        questionsController.currentQuestion = QuestionIds.Meals;

        saveSimulationAnswerUseCase.execute({ meals: { vegan: 4, vegetarian: 3, whiteMeat: 2, redMeat: 1, whiteFish: 2, fish: 2 } });

        expect(showNextQuestionSpy).toHaveBeenCalledWith(QuestionIds.CarKmType);
      });

      it('be electric car size if car engine is electric', () => {
        questionsController.currentQuestion = QuestionIds.CarKmType;

        saveSimulationAnswerUseCase.execute({ carUsage: { km: 4000, engineType: EngineType.electric } });

        expect(showNextQuestionSpy).toHaveBeenCalledWith(QuestionIds.ElectricCarSize);
      });

      it('be fuel car consumption if car engine is not electric', () => {
        questionsController.currentQuestion = QuestionIds.CarKmType;

        saveSimulationAnswerUseCase.execute({ carUsage: { km: 4000, engineType: EngineType.hybrid } });

        expect(showNextQuestionSpy).toHaveBeenCalledWith(QuestionIds.FuelCarConsumption);
      });

      it('not be fuel car consumption after electric car size', () => {
        questionsController.currentQuestion = QuestionIds.ElectricCarSize;

        saveSimulationAnswerUseCase.execute({ electricCar: { size: CarSize.sedan } });

        expect(showNextQuestionSpy).toHaveBeenCalledTimes(0);
      });
    });
  });
});
