import { NavigationProp } from '@react-navigation/native';
import { BreakfastTypes } from 'carbon-cut-commons';
import { useState } from 'react';
import { View } from 'react-native';
import { WebBreakfastQuestionPresenter } from '../../../../adapters/presenters/simulation/web-breakfast-question.presenter';
import { SelectableAnswer, BreakfastQuestionPresenterToken } from '../../../../domain/ports/presenters/question.presenter';
import { SaveSimulationAnswerUseCase, SaveSimulationAnswerUseCaseToken } from '../../../../domain/usecases/save-simulation-answer.usecase';
import { diContainer } from '../../../inversify.config';
import { RootStackParamList, Routes } from '../../../root-navigation';
import Question from '../components/question';
import SelectableAnswers from '../components/selectable-answers';
import SubmitButton from '../components/submit-button';

type BreakfastNavigationProp = NavigationProp<RootStackParamList, Routes.Breakfast>;
type BreakfastAnswer = SelectableAnswer<BreakfastTypes>;

export default function Breakfast({ navigation }: { navigation: BreakfastNavigationProp }) {
  const [presenter] = useState<WebBreakfastQuestionPresenter>(
    diContainer.get<WebBreakfastQuestionPresenter>(BreakfastQuestionPresenterToken),
  );
  const [saveSimulationAnswerUseCase] = useState<SaveSimulationAnswerUseCase>(
    diContainer.get<SaveSimulationAnswerUseCase>(SaveSimulationAnswerUseCaseToken),
  );
  const { viewModel } = presenter;
  const question = presenter.viewModel.questions[0];
  const [answers, updateAnswers] = useState<BreakfastAnswer[]>(question.answers);

  const setSelectedBreakfast = (answer: BreakfastAnswer): void => {
    presenter.setAnswer(answer.value);
    updateAnswers(question.answers);
  };

  const saveAnswer = (): void => {
    saveSimulationAnswerUseCase.execute({ answerKey: 'breakfast', answer: viewModel.selectedAnswer });
    navigation.navigate(Routes.HotBeverages);
  };

  return (
    <View>
      <Question question={question.question}>
        <SelectableAnswers answers={answers} answerSelected={(answer) => setSelectedBreakfast(answer)} />
      </Question>
      <SubmitButton isLastQuestion={false} canSubmit={viewModel.canSubmit} nextButtonClicked={() => saveAnswer()} />
    </View>
  );
}
