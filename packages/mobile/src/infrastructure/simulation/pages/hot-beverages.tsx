import { StyleProp, View, ViewStyle } from 'react-native';
import { NavigationProp } from '@react-navigation/native';

import InputAnswers from '../components/input-answers';
import Question from '../components/question';
import SubmitButton from '../components/submit-button';
import { useEffect, useState } from 'react';
import {
  HotBeveragesKeys,
  HotBeverageViewModel,
  WebHotBeveragesQuestionPresenter,
} from '../../../adapters/simulation/presenters/web-hot-beverages-question.presenter';
import { HotBeveragesQuestionPresenterToken } from '../../../domain/ports/presenters/question.presenter';
import { SaveSimulationAnswerUseCase, SaveSimulationAnswerUseCaseToken } from '../../../domain/usecases/save-simulation-answer.usecase';
import { diContainer } from '../../inversify.config';
import { RootStackParamList, Routes } from '../../root-navigation';
import { SetInputAnswerUseCase, SetInputAnswerUseCaseToken } from '../../../domain/usecases/set-input-answer.usecase';

type HotBeveragesNavigationProp = NavigationProp<RootStackParamList, Routes.HotBeverages>;
type HotBeveragesProps = {
  navigation: HotBeveragesNavigationProp;
  containerStyle: StyleProp<ViewStyle>;
};

export default function HotBeverages({ navigation, containerStyle }: HotBeveragesProps) {
  const [presenter] = useState<WebHotBeveragesQuestionPresenter>(
    diContainer.get<WebHotBeveragesQuestionPresenter>(HotBeveragesQuestionPresenterToken),
  );
  const [setInputAnswerUseCase] = useState<SetInputAnswerUseCase>(diContainer.get<SetInputAnswerUseCase>(SetInputAnswerUseCaseToken));
  const [saveSimulationAnswerUseCase] = useState<SaveSimulationAnswerUseCase>(
    diContainer.get<SaveSimulationAnswerUseCase>(SaveSimulationAnswerUseCaseToken),
  );
  const [nextNavigateRoute, setNextNavigateRoute] = useState<Routes>(presenter.nextNavigateRoute());

  const [viewModel, updateViewModel] = useState<HotBeverageViewModel>(presenter.viewModel);

  useEffect(() => {
    presenter.onViewModelChanges(updateViewModel);
  }, [presenter, presenter.viewModel]);

  const setAnswer = (value: string, id: HotBeveragesKeys): void => {
    setInputAnswerUseCase.execute(presenter, { id, value });
    setNextNavigateRoute(presenter.nextNavigateRoute());
  };

  const saveAnswer = (): void => {
    saveSimulationAnswerUseCase.execute({ answerKey: 'hotBeverages', answer: presenter.answerValues });
    navigation.navigate(nextNavigateRoute, { containerStyle });
  };

  return (
    <View style={containerStyle}>
      <Question question={viewModel.question}>
        <InputAnswers answers={viewModel.answers} answerChanged={(value, answerKey) => setAnswer(value, answerKey)} />
      </Question>
      <SubmitButton isLastQuestion={false} canSubmit={viewModel.canSubmit} nextButtonClicked={() => saveAnswer()} />
    </View>
  );
}
