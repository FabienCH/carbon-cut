import { NavigationProp } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import {
  BreakfastAnswer,
  BreakfastViewModel,
  WebBreakfastQuestionPresenter,
} from '@adapters/simulation/presenters/alimentation/web-breakfast-question.presenter';
import { BreakfastQuestionPresenterToken } from '@domain/ports/presenters/question.presenter';
import { SaveSimulationAnswerUseCase, SaveSimulationAnswerUseCaseToken } from '@domain/usecases/save-simulation-answer.usecase';
import { diContainer } from '../../../inversify.config';
import { RootStackParamList, Route, AllRoutes } from '../../../root-navigation';
import Question from '../../components/question';
import SelectableAnswers from '../../components/selectable-answers';
import SubmitButton from '../../components/submit-button';

type BreakfastNavigationProp = NavigationProp<RootStackParamList, Route<'Breakfast'>>;
type BreakfastProps = {
  navigation: BreakfastNavigationProp;
  containerStyle: StyleProp<ViewStyle>;
};

export default function Breakfast({ navigation, containerStyle }: BreakfastProps) {
  const [presenter] = useState<WebBreakfastQuestionPresenter>(
    diContainer.get<WebBreakfastQuestionPresenter>(BreakfastQuestionPresenterToken),
  );
  const [saveSimulationAnswerUseCase] = useState<SaveSimulationAnswerUseCase>(
    diContainer.get<SaveSimulationAnswerUseCase>(SaveSimulationAnswerUseCaseToken),
  );
  const [viewModel, updateViewModel] = useState<BreakfastViewModel>(presenter.viewModel);

  useEffect(() => {
    presenter.onViewModelChanges(updateViewModel);
  }, [presenter, presenter.viewModel]);

  const setSelectedBreakfast = (answer: BreakfastAnswer): void => {
    presenter.setSelectedAnswer(answer.value);
  };

  const saveAnswer = (): void => {
    saveSimulationAnswerUseCase.execute({ breakfast: presenter.selectedAnswer });
    navigation.navigate(AllRoutes.HotBeverages, { containerStyle });
  };

  return (
    <View style={containerStyle}>
      <Question question={viewModel.question}>
        <SelectableAnswers answers={viewModel.answers} answerSelected={(answer) => setSelectedBreakfast(answer)} />
      </Question>
      <SubmitButton isLastQuestion={false} canSubmit={viewModel.canSubmit} nextButtonClicked={() => saveAnswer()} />
    </View>
  );
}
