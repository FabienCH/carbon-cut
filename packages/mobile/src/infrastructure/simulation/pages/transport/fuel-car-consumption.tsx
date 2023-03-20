import { FuelType } from 'carbon-cut-commons';
import { useEffect, useState } from 'react';
import { ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useSelector } from 'react-redux';
import { selectIsLoading } from '@adapters/commons/store/selectors/loading-selectors';
import {
  FuelCarConsumptionAnswerViewModel,
  WebFuelCarConsumptionQuestionPresenter,
} from '@adapters/simulation/presenters/transport/web-fuel-car-consumption-question.presenter';

import { AnswerValidator } from '@domain/entites/answer-validator';
import { Answer, FuelCarConsumptionQuestionPresenterToken } from '@domain/ports/presenters/question.presenter';

import {
  CarbonFootprintSimulationUseCase,
  CarbonFootprintSimulationUseCaseToken,
} from '@domain/usecases/carbon-footprint-simulation.usescase';
import { SaveSimulationAnswerUseCase, SaveSimulationAnswerUseCaseToken } from '@domain/usecases/save-simulation-answer.usecase';
import { SetInputAnswerUseCase, SetInputAnswerUseCaseToken } from '@domain/usecases/set-input-answer.usecase';
import { diContainer } from '../../../inversify.config';
import InputAnswers from '../../components/input-answers';
import Question from '../../components/question';
import SelectableAnswers from '../../components/selectable-answers';
import SubmitButton from '../../components/submit-button';

export default function FuelCarConsumption({ containerStyle }: { containerStyle: StyleProp<ViewStyle> }) {
  const [presenter] = useState<WebFuelCarConsumptionQuestionPresenter>(
    diContainer.get<WebFuelCarConsumptionQuestionPresenter>(FuelCarConsumptionQuestionPresenterToken),
  );
  const [setInputAnswerUseCase] = useState<SetInputAnswerUseCase>(diContainer.get<SetInputAnswerUseCase>(SetInputAnswerUseCaseToken));
  const [saveSimulationAnswerUseCase] = useState<SaveSimulationAnswerUseCase>(
    diContainer.get<SaveSimulationAnswerUseCase>(SaveSimulationAnswerUseCaseToken),
  );
  const [carbonFootprintSimulationUseCase] = useState<CarbonFootprintSimulationUseCase>(
    diContainer.get<CarbonFootprintSimulationUseCase>(CarbonFootprintSimulationUseCaseToken),
  );

  const [viewModel, updateViewModel] = useState<FuelCarConsumptionAnswerViewModel>(presenter.viewModel);
  const isLoading = useSelector(selectIsLoading);

  useEffect(() => {
    presenter.onViewModelChanges(updateViewModel);
  }, [presenter, presenter.viewModel]);

  const setAnswer = (value: string): void => {
    setInputAnswerUseCase.execute(
      presenter,
      { id: 'fuelConsumption', value },
      {
        answerValidatorsFn: [AnswerValidator.positiveNumberValidator],
      },
    );
  };

  const setSelectedEngineType = (answer: Answer<FuelType>): void => {
    presenter.setSelectedAnswer(answer.value);
  };

  const runCalculation = (): void => {
    saveSimulationAnswerUseCase.execute({ fuelCar: { ...presenter.answerValues, fuelType: presenter.selectedAnswer } });
    carbonFootprintSimulationUseCase.execute();
  };
  const { selectableQuestion, inputQuestion } = viewModel.questions;
  return (
    <View style={containerStyle}>
      <ScrollView style={styles.scrollView}>
        <Question question={selectableQuestion.question}>
          <SelectableAnswers answers={selectableQuestion.answers} answerSelected={(answer) => setSelectedEngineType(answer)} />
        </Question>
        <Question question={inputQuestion.question}>
          <InputAnswers answers={[inputQuestion.answer]} answerChanged={(value) => setAnswer(value)} />
        </Question>
      </ScrollView>
      <SubmitButton
        isLastQuestion={true}
        canSubmit={viewModel.canSubmit}
        isLoading={isLoading}
        nextButtonClicked={() => runCalculation()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 0,
  },
});
