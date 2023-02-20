import { EngineType } from 'carbon-cut-commons';
import { useEffect, useState } from 'react';
<<<<<<< HEAD
import { StyleProp, View, ViewStyle } from 'react-native';
=======
import { ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
>>>>>>> 7e9bf37 (feat(simulation): add car km and type question component)
import { useSelector } from 'react-redux';
import { selectIsLoading } from '../../../../adapters/commons/store/selectors/loading-selectors';
import {
  CarAnswerViewModel,
  WebCarKmTypeQuestionPresenter,
} from '../../../../adapters/simulation/presenters/transport/web-car-km-type-question.presenter';
import { AnswerValidator } from '../../../../domain/entites/answer-validator';
import { Answer, CarKmTypeQuestionPresenterToken } from '../../../../domain/ports/presenters/question.presenter';

import {
  CarbonFootprintSimulationUseCase,
  CarbonFootprintSimulationUseCaseToken,
} from '../../../../domain/usecases/carbon-footprint-simulation.usescase';
import { SaveSimulationAnswerUseCase, SaveSimulationAnswerUseCaseToken } from '../../../../domain/usecases/save-simulation-answer.usecase';
import { SetInputAnswerUseCase, SetInputAnswerUseCaseToken } from '../../../../domain/usecases/set-input-answer.usecase';
import { diContainer } from '../../../inversify.config';
import InputAnswers from '../../components/input-answers';
import Question from '../../components/question';
import SelectableAnswers from '../../components/selectable-answers';
import SubmitButton from '../../components/submit-button';

export default function CarKmType({ containerStyle }: { containerStyle: StyleProp<ViewStyle> }) {
  const [presenter] = useState<WebCarKmTypeQuestionPresenter>(
    diContainer.get<WebCarKmTypeQuestionPresenter>(CarKmTypeQuestionPresenterToken),
  );
  const [setInputAnswerUseCase] = useState<SetInputAnswerUseCase>(diContainer.get<SetInputAnswerUseCase>(SetInputAnswerUseCaseToken));
  const [saveSimulationAnswerUseCase] = useState<SaveSimulationAnswerUseCase>(
    diContainer.get<SaveSimulationAnswerUseCase>(SaveSimulationAnswerUseCaseToken),
  );
  const [carbonFootprintSimulationUseCase] = useState<CarbonFootprintSimulationUseCase>(
    diContainer.get<CarbonFootprintSimulationUseCase>(CarbonFootprintSimulationUseCaseToken),
  );

  const [viewModel, updateViewModel] = useState<CarAnswerViewModel>(presenter.viewModel);
  const isLoading = useSelector(selectIsLoading);

  useEffect(() => {
    presenter.onViewModelChanges(updateViewModel);
  }, [presenter, presenter.viewModel]);

  const setAnswer = (value: string): void => {
<<<<<<< HEAD
    setInputAnswerUseCase.execute(presenter, { id: 'km', value }, { answerValidatorsFn: [AnswerValidator.positiveNumberValidator] });
=======
    setInputAnswerUseCase.execute(
      presenter,
      { id: 'km', value },
      {
        answerValidatorsFn: [AnswerValidator.positiveNumberValidator],
      },
    );
>>>>>>> 7e9bf37 (feat(simulation): add car km and type question component)
  };

  const setSelectedEngineType = (answer: Answer<EngineType>): void => {
    presenter.setSelectedAnswer(answer.value);
  };

  const runCalculation = (): void => {
    saveSimulationAnswerUseCase.execute({
      sector: 'transport',
      answerKey: 'car',
      answer: { ...presenter.answerValues, engineType: presenter.selectedAnswer },
    });
    carbonFootprintSimulationUseCase.execute();
  };

  return (
    <View style={containerStyle}>
<<<<<<< HEAD
      <Question question={viewModel.engineTypeQuestion.question}>
        <SelectableAnswers answers={viewModel.engineTypeQuestion.answers} answerSelected={(answer) => setSelectedEngineType(answer)} />
      </Question>
      <Question question={viewModel.kmQuestion.question}>
        <InputAnswers answers={[viewModel.kmQuestion.answer]} answerChanged={(value) => setAnswer(value)} />
      </Question>
=======
      <ScrollView style={styles.scrollView}>
        <Question question={viewModel.engineTypeQuestion.question}>
          <SelectableAnswers answers={viewModel.engineTypeQuestion.answers} answerSelected={(answer) => setSelectedEngineType(answer)} />
        </Question>
        <Question question={viewModel.kmQuestion.question}>
          <InputAnswers answers={[viewModel.kmQuestion.answer]} answerChanged={(value) => setAnswer(value)} />
        </Question>
      </ScrollView>
>>>>>>> 7e9bf37 (feat(simulation): add car km and type question component)
      <SubmitButton
        isLastQuestion={true}
        canSubmit={viewModel.canSubmit}
        isLoading={isLoading}
        nextButtonClicked={() => runCalculation()}
      />
    </View>
  );
}
<<<<<<< HEAD
=======

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 0,
  },
});
>>>>>>> 7e9bf37 (feat(simulation): add car km and type question component)
