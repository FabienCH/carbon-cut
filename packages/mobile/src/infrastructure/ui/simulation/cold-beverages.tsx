import { Button, Text, Input } from '@rneui/themed';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ColdBeveragesKeys, WebColdBeveragesQuestionPresenter } from '../../../adapters/presenters/web-cold-beverages-question.presenter';
import { Answer, ColdBeveragesQuestionPresenterToken } from '../../../domain/ports/presenters/question.presenter';
import { diContainer } from '../../inversify.config';
import { SaveSimulationAnswerUseCase, SaveSimulationAnswerUseCaseToken } from '../../../domain/usecases/save-simulation-answer.usecase';
import { useSelector } from 'react-redux';
import {
  CarbonFootprintSimulationUseCase,
  CarbonFootprintSimulationUseCaseToken,
} from '../../../domain/usecases/carbon-footprint-simulation.usescase';
import { selectIsLoading } from '../../store/selectors/loading-selectors';

type ColdBeveragesAnswer = Answer<ColdBeveragesKeys, number | null>;

export default function ColdBeverages() {
  const [presenter] = useState<WebColdBeveragesQuestionPresenter>(
    diContainer.get<WebColdBeveragesQuestionPresenter>(ColdBeveragesQuestionPresenterToken),
  );
  const [saveSimulationAnswerUseCase] = useState<SaveSimulationAnswerUseCase>(
    diContainer.get<SaveSimulationAnswerUseCase>(SaveSimulationAnswerUseCaseToken),
  );
  const [carbonFootprintSimulationUseCase] = useState<CarbonFootprintSimulationUseCase>(
    diContainer.get<CarbonFootprintSimulationUseCase>(CarbonFootprintSimulationUseCaseToken),
  );
  const isLoading = useSelector(selectIsLoading);

  const [answers, updateAnswers] = useState<ColdBeveragesAnswer[]>(presenter.viewModel.answers);
  const { viewModel } = presenter;

  const setAnswer = (key: ColdBeveragesKeys, value: string): void => {
    presenter.setAnswer({ key, value });
    updateAnswers(viewModel.answers);
  };

  const runCalculation = (): void => {
    saveSimulationAnswerUseCase.execute({ answerKey: 'coldBeverages', answer: presenter.simulationBeverages() });
    carbonFootprintSimulationUseCase.execute();
  };

  return (
    <View style={styles.container}>
      <Text accessibilityRole="header" style={styles.question}>
        {viewModel.question}
      </Text>
      {answers.map((answer) => {
        const accessibilityLabel = `Entrez le nombre de ${answer.label} par semaine`;
        return (
          <Input
            key={answer.id}
            accessibilityLabel={accessibilityLabel}
            label={answer.label}
            placeholder={answer.placeholder}
            keyboardType="numeric"
            containerStyle={styles.answer}
            labelStyle={styles.labelStyle}
            renderErrorMessage={!!answer.errorMessage}
            errorMessage={answer.errorMessage}
            onChangeText={(value) => setAnswer(answer.id, value)}
          />
        );
      })}
      <Button
        accessibilityRole="button"
        containerStyle={styles.button}
        disabled={!viewModel.canSubmit}
        loading={isLoading}
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
    marginBottom: 20,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  answer: {
    marginVertical: 15,
  },

  labelStyle: {
    color: '#000000',
  },
  button: {
    marginTop: 30,
  },
});
