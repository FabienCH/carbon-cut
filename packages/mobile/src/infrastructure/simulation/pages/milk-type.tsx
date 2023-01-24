import { NavigationProp } from '@react-navigation/native';
import { MilkTypes } from 'carbon-cut-commons';
import { useState } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { WebMilkTypeQuestionPresenter } from '../../../adapters/simulation/presenters/web-milk-type-question.presenter';
import { SelectableAnswer, MilkTypeQuestionPresenterToken } from '../../../domain/ports/presenters/question.presenter';
import { SaveSimulationAnswerUseCase, SaveSimulationAnswerUseCaseToken } from '../../../domain/usecases/save-simulation-answer.usecase';
import { diContainer } from '../../inversify.config';
import { RootStackParamList, Routes } from '../../root-navigation';
import Question from '../components/question';
import SelectableAnswers from '../components/selectable-answers';
import SubmitButton from '../components/submit-button';

type MilkTypeAnswer = SelectableAnswer<MilkTypes>;
type MilkTypeNavigationProp = NavigationProp<RootStackParamList, Routes.MilkType>;
type MilkTypeProps = {
  navigation: MilkTypeNavigationProp;
  containerStyle: StyleProp<ViewStyle>;
};

export default function MilkType({ navigation, containerStyle }: MilkTypeProps) {
  const [presenter] = useState<WebMilkTypeQuestionPresenter>(diContainer.get<WebMilkTypeQuestionPresenter>(MilkTypeQuestionPresenterToken));
  const [saveSimulationAnswerUseCase] = useState<SaveSimulationAnswerUseCase>(
    diContainer.get<SaveSimulationAnswerUseCase>(SaveSimulationAnswerUseCaseToken),
  );
  const { viewModel } = presenter;
  const question = viewModel.questions[0];
  const [answers, updateAnswers] = useState<MilkTypeAnswer[]>(question.answers);

  const setSelectedMilkType = (answer: MilkTypeAnswer): void => {
    presenter.setAnswer(answer.value);
    updateAnswers(viewModel.questions[0].answers);
  };

  const saveAnswer = (): void => {
    saveSimulationAnswerUseCase.execute({ answerKey: 'milkType', answer: viewModel.selectedAnswer });
    navigation.navigate(Routes.ColdBeverages, { containerStyle });
  };

  return (
    <View style={containerStyle}>
      <Question question={question.question}>
        <SelectableAnswers answers={answers} answerSelected={(answer) => setSelectedMilkType(answer)} />
      </Question>
      <SubmitButton isLastQuestion={false} canSubmit={viewModel.canSubmit} nextButtonClicked={() => saveAnswer()} />
    </View>
  );
}
