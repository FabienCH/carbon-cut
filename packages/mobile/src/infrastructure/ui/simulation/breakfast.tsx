import { Text } from '@rneui/base';
import { Button, Chip } from '@rneui/themed';
import { BreakfastTypes } from 'carbon-cut-commons';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebBreakfastQuestionPresenter } from '../../../adapters/presenters/web-breakfast-question.presenter';
import { Answer, BreakfastQuestionPresenterToken, QuestionPresenter } from '../../../domain/ports/presenters/question.presenter';
import {
  CarbonFootprintSimulationUseCase,
  CarbonFootprintSimulationUseCaseToken,
} from '../../../domain/usecases/carbon-footprint-simulation.usescase';
import { diContainer } from '../../inversify.config';

const presenter: WebBreakfastQuestionPresenter = diContainer.get<QuestionPresenter<BreakfastTypes>>(BreakfastQuestionPresenterToken);
const carbonFootprintSimulationUseCase: CarbonFootprintSimulationUseCase = diContainer.get<CarbonFootprintSimulationUseCase>(
  CarbonFootprintSimulationUseCaseToken,
);

type BreakfastAnswer = Answer<BreakfastTypes>;

export default function Breakfast() {
  const { viewModel } = presenter;
  const [answers, updateAnswers] = useState<BreakfastAnswer[]>(viewModel.answers);

  const setSelectedBreakfast = (answer: BreakfastAnswer): void => {
    presenter.setSelectedAnswer(answer.value);
    updateAnswers(viewModel.answers);
  };

  const runCalculation = (): void => {
    carbonFootprintSimulationUseCase.execute(viewModel.selectedAnswer);
  };

  return (
    <View style={styles.container}>
      <Text accessibilityRole="header" style={styles.question}>
        {viewModel.question}
      </Text>
      {answers.map((answer) => {
        const type = answer.selected ? 'solid' : 'outline';
        return (
          <Chip
            accessibilityRole="radio"
            title={answer.label}
            key={answer.value}
            containerStyle={styles.answer}
            type={type}
            onPress={() => setSelectedBreakfast(answer)}
          />
        );
      })}
      <Button
        accessibilityRole="button"
        containerStyle={styles.button}
        disabled={!viewModel.selectedAnswer}
        onPress={() => runCalculation()}
      >
        Calculer mon empreinte
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  question: {
    marginBottom: 10,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  answer: {
    marginVertical: 5,
  },
  button: {
    marginTop: 30,
  },
});
