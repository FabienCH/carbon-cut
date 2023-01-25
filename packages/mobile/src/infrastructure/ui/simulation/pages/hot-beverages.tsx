import { Button, Text, Input } from '@rneui/themed';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { NavigationProp } from '@react-navigation/native';
import { useSelector } from 'react-redux';
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

type HotBeveragesAnswer = Answer<HotBeveragesKeys, string | null>;
type HotBeveragesNavigationProp = NavigationProp<RootStackParamList, Routes.HotBeverages>;

export default function HotBeverages({ navigation }: { navigation: HotBeveragesNavigationProp }) {
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
    navigation.navigate(nextNavigateRoute);
  };

  return (
    <View>
      <Question question={question.question}>
        <InputAnswers answers={answers} answerChanged={(answerKey, value) => setAnswer(answerKey, value)} />
      </Question>
      <SubmitButton isLastQuestion={false} canSubmit={viewModel.canSubmit} nextButtonClicked={() => saveAnswer()} />
    </View>
  );
}
