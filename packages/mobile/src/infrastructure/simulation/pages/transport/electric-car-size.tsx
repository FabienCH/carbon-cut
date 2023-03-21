import { useEffect, useState } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { useSelector } from 'react-redux';
import { selectIsLoading } from '@adapters/commons/store/selectors/loading-selectors';
import {
  ElectricCarSizeAnswer,
  ElectricCarSizeViewModel,
  WebElectricCarSizeQuestionPresenter,
} from '@adapters/simulation/presenters/transport/web-electric-car-size-question.presenter';
import { ElectricCarSizeQuestionPresenterToken } from '@domain/ports/presenters/question.presenter';
import {
  CarbonFootprintSimulationUseCase,
  CarbonFootprintSimulationUseCaseToken,
} from '@domain/usecases/carbon-footprint-simulation.usescase';
import { SaveSimulationAnswerUseCase, SaveSimulationAnswerUseCaseToken } from '@domain/usecases/save-simulation-answer.usecase';
import { diContainer } from '../../../inversify.config';
import Question from '../../components/question';
import SelectableAnswers from '../../components/selectable-answers';
import SubmitButton from '../../components/submit-button';

export default function ElectricCarSize({ containerStyle }: { containerStyle: StyleProp<ViewStyle> }) {
  const [presenter] = useState<WebElectricCarSizeQuestionPresenter>(
    diContainer.get<WebElectricCarSizeQuestionPresenter>(ElectricCarSizeQuestionPresenterToken),
  );
  const [saveSimulationAnswerUseCase] = useState<SaveSimulationAnswerUseCase>(
    diContainer.get<SaveSimulationAnswerUseCase>(SaveSimulationAnswerUseCaseToken),
  );
  const [carbonFootprintSimulationUseCase] = useState<CarbonFootprintSimulationUseCase>(
    diContainer.get<CarbonFootprintSimulationUseCase>(CarbonFootprintSimulationUseCaseToken),
  );
  const [viewModel, updateViewModel] = useState<ElectricCarSizeViewModel>(presenter.viewModel);
  const isLoading = useSelector(selectIsLoading);

  useEffect(() => {
    presenter.onViewModelChanges(updateViewModel);
  }, [presenter, presenter.viewModel]);

  const setSelectedElectricCarSize = (answer: ElectricCarSizeAnswer): void => {
    presenter.setSelectedAnswer(answer.value);
  };

  const runCalculation = (): void => {
    saveSimulationAnswerUseCase.execute({ electricCar: { size: presenter.selectedAnswer } });
    carbonFootprintSimulationUseCase.execute();
  };

  return (
    <View style={containerStyle}>
      <Question question={viewModel.question}>
        <SelectableAnswers answers={viewModel.answers} answerSelected={(answer) => setSelectedElectricCarSize(answer)} />
      </Question>
      <SubmitButton
        isLastQuestion={true}
        canSubmit={viewModel.canSubmit}
        isLoading={isLoading}
        nextButtonClicked={() => runCalculation()}
      />
    </View>
  );
}
