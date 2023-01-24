import { StyleProp, View, ViewStyle } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import {
  HotBeveragesKeys,
  WebHotBeveragesQuestionPresenter,
} from '../../../../adapters/presenters/simulation/web-hot-beverages-question.presenter';
import { Answer, HotBeveragesQuestionPresenterToken } from '../../../../domain/ports/presenters/question.presenter';
import { SaveSimulationAnswerUseCase, SaveSimulationAnswerUseCaseToken } from '../../../../domain/usecases/save-simulation-answer.usecase';
import { diContainer } from '../../../inversify.config';
import { RootStackParamList, Routes } from '../../../root-navigation';
import InputAnswers from '../components/input-answers';
import Question from '../components/question';
import SubmitButton from '../components/submit-button';
import { useState } from 'react';

type HotBeveragesAnswer = Answer<HotBeveragesKeys, string | null>;
type HotBeveragesNavigationProp = NavigationProp<RootStackParamList, Routes.HotBeverages>;
type HotBeveragesProps = {
  navigation: HotBeveragesNavigationProp;
  containerStyle: StyleProp<ViewStyle>;
};

export default function HotBeverages({ navigation, containerStyle }: HotBeveragesProps) {
  const [presenter] = useState<WebHotBeveragesQuestionPresenter>(
    diContainer.get<WebHotBeveragesQuestionPresenter>(HotBeveragesQuestionPresenterToken),
  );
  const [saveSimulationAnswerUseCase] = useState<SaveSimulationAnswerUseCase>(
    diContainer.get<SaveSimulationAnswerUseCase>(SaveSimulationAnswerUseCaseToken),
  );

  const { viewModel } = presenter;
  const question = presenter.viewModel.questions[0];

  const [answers, updateAnswers] = useState<HotBeveragesAnswer[]>(question.answers);
  const [nextNavigateRoute, setNextNavigateRoute] = useState<Routes>(presenter.nextNavigateRoute());

  const setAnswer = (key: HotBeveragesKeys, value: string): void => {
    presenter.setAnswer({ key, value });
    setNextNavigateRoute(presenter.nextNavigateRoute());
    updateAnswers(viewModel.questions[0].answers);
  };

  const saveAnswer = (): void => {
    saveSimulationAnswerUseCase.execute({ answerKey: 'hotBeverages', answer: presenter.getAnswers() });
    navigation.navigate(nextNavigateRoute, { containerStyle });
  };

  return (
    <View style={containerStyle}>
      <Question question={question.question}>
        <InputAnswers answers={answers} answerChanged={(answerKey, value) => setAnswer(answerKey, value)} />
      </Question>
      <SubmitButton isLastQuestion={false} canSubmit={viewModel.canSubmit} nextButtonClicked={() => saveAnswer()} />
    </View>
  );
}
