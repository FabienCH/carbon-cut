import { Text, useTheme } from '@rneui/themed';
import { MealsAnswer } from 'carbon-cut-commons';
import { useEffect, useState } from 'react';
import { ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useSelector } from 'react-redux';
import { selectIsLoading } from '../../../adapters/commons/store/selectors/loading-selectors';
import { MealViewModel, WebMealsQuestionPresenter } from '../../../adapters/simulation/presenters/web-meals-question.presenter';
import { AnswerValidator } from '../../../domain/entites/answer-validator';
import { MealsQuestionPresenterToken } from '../../../domain/ports/presenters/question.presenter';

import {
  CarbonFootprintSimulationUseCase,
  CarbonFootprintSimulationUseCaseToken,
} from '../../../domain/usecases/carbon-footprint-simulation.usescase';
import { SaveSimulationAnswerUseCase, SaveSimulationAnswerUseCaseToken } from '../../../domain/usecases/save-simulation-answer.usecase';
import { SetInputAnswerUseCase, SetInputAnswerUseCaseToken } from '../../../domain/usecases/set-input-answer.usecase';
import { errorStyle } from '../../app/style';
import { diContainer } from '../../inversify.config';
import InputAnswers from '../components/input-answers';
import Question from '../components/question';
import SubmitButton from '../components/submit-button';

export type MealsAnswerKeys = keyof MealsAnswer;

export default function Meals({ containerStyle }: { containerStyle: StyleProp<ViewStyle> }) {
  const { theme } = useTheme();
  const [presenter] = useState<WebMealsQuestionPresenter>(diContainer.get<WebMealsQuestionPresenter>(MealsQuestionPresenterToken));
  const [setInputAnswerUseCase] = useState<SetInputAnswerUseCase>(diContainer.get<SetInputAnswerUseCase>(SetInputAnswerUseCaseToken));
  const [saveSimulationAnswerUseCase] = useState<SaveSimulationAnswerUseCase>(
    diContainer.get<SaveSimulationAnswerUseCase>(SaveSimulationAnswerUseCaseToken),
  );
  const [carbonFootprintSimulationUseCase] = useState<CarbonFootprintSimulationUseCase>(
    diContainer.get<CarbonFootprintSimulationUseCase>(CarbonFootprintSimulationUseCaseToken),
  );

  const [viewModel, updateViewModel] = useState<MealViewModel>(presenter.viewModel);
  const isLoading = useSelector(selectIsLoading);

  useEffect(() => {
    presenter.onViewModelChanges(updateViewModel);
  }, [presenter, presenter.viewModel]);

  const setAnswer = (value: string, id: MealsAnswerKeys): void => {
    setInputAnswerUseCase.execute(
      presenter,
      { id, value },
      {
        answerValidatorsFn: [AnswerValidator.positiveNumberValidator],
        formValidatorsFn: [(values) => AnswerValidator.isNumberEqualValidator(values, 14)],
      },
    );
  };

  const runCalculation = (): void => {
    saveSimulationAnswerUseCase.execute({ answerKey: 'meals', answer: presenter.answerValues });
    carbonFootprintSimulationUseCase.execute();
  };

  return (
    <View style={containerStyle}>
      <ScrollView style={styles.scrollView}>
        <Question question={viewModel.question}>
          <InputAnswers answers={viewModel.answers} answerChanged={(value, answerKey) => setAnswer(value, answerKey)} />
        </Question>
      </ScrollView>
      {viewModel.formError ? <Text style={errorStyle(theme).error}>{viewModel.formError}</Text> : null}
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
