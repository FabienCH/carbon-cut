import { useEffect, useState } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import {
  MilkTypeAnswer,
  MilkTypeViewModel,
  WebMilkTypeQuestionPresenter,
} from '@adapters/simulation/presenters/alimentation/web-milk-type-question.presenter';
import { MilkTypeQuestionPresenterToken } from '@domain/ports/presenters/question.presenter';
import { SaveSimulationAnswerUseCase, SaveSimulationAnswerUseCaseToken } from '@domain/usecases/save-simulation-answer.usecase';
import { diContainer } from '../../../inversify.config';
import Question from '../../components/question';
import SelectableAnswers from '../../components/selectable-answers';
import SubmitButton from '../../components/submit-button';

export default function MilkType({ containerStyle }: { containerStyle: StyleProp<ViewStyle> }) {
  const [presenter] = useState<WebMilkTypeQuestionPresenter>(diContainer.get<WebMilkTypeQuestionPresenter>(MilkTypeQuestionPresenterToken));
  const [saveSimulationAnswerUseCase] = useState<SaveSimulationAnswerUseCase>(
    diContainer.get<SaveSimulationAnswerUseCase>(SaveSimulationAnswerUseCaseToken),
  );
  const [viewModel, updateViewModel] = useState<MilkTypeViewModel>(presenter.viewModel);

  useEffect(() => {
    presenter.onViewModelChanges(updateViewModel);
  }, [presenter, presenter.viewModel]);

  const setSelectedMilkType = (answer: MilkTypeAnswer): void => {
    presenter.setSelectedAnswer(answer.value);
  };

  const saveAnswer = (): void => {
    saveSimulationAnswerUseCase.execute({ milkType: presenter.selectedAnswer });
  };

  return (
    <View style={containerStyle}>
      <Question question={viewModel.question}>
        <SelectableAnswers answers={viewModel.answers} answerSelected={(answer) => setSelectedMilkType(answer)} />
      </Question>
      <SubmitButton isLastQuestion={false} canSubmit={viewModel.canSubmit} nextButtonClicked={() => saveAnswer()} />
    </View>
  );
}
