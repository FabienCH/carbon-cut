import { Button, Text, Input } from '@rneui/themed';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Answer, ColdBeveragesQuestionPresenterToken } from '../../../domain/ports/presenters/question.presenter';
import { diContainer } from '../../inversify.config';
import { SaveSimulationAnswerUseCase, SaveSimulationAnswerUseCaseToken } from '../../../domain/usecases/save-simulation-answer.usecase';
import { useSelector } from 'react-redux';
import {
  CarbonFootprintSimulationUseCase,
  CarbonFootprintSimulationUseCaseToken,
} from '../../../domain/usecases/carbon-footprint-simulation.usescase';
import { selectIsLoading } from '../../store/selectors/loading-selectors';
import {
  ColdBeveragesKeys,
  WebColdBeveragesQuestionPresenter,
} from '../../../adapters/presenters/simulation/web-cold-beverages-question.presenter';

type ColdBeveragesQuestion = { question: string; answers: Answer<ColdBeveragesKeys, string | null>[] };

export default function ColdBeveragesAnswer() {
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

  const [questions, updateQuestion] = useState<ColdBeveragesQuestion[]>(presenter.viewModel.questions);
  const { viewModel } = presenter;

  const setAnswer = (key: ColdBeveragesKeys, value: string, questionIndex: number): void => {
    presenter.setAnswer({ key, value }, questionIndex);
    updateQuestion(viewModel.questions);
  };

  const runCalculation = (): void => {
    saveSimulationAnswerUseCase.execute({ answerKey: 'coldBeverages', answer: presenter.getAnswers() });
    carbonFootprintSimulationUseCase.execute();
  };

  return (
    <View style={styles.container}>
      {questions.map((questionItem, questionIdx) => {
        return (
          <View key={questionIdx} style={styles.questionContainer}>
            <Text accessibilityRole="header" style={styles.question}>
              {questionItem.question}
            </Text>
            {questionItem.answers.map((answer) => {
              const accessibilityLabel = `Entrez le nombre de ${answer.label} par semaine`;
              return (
                <Input
                  key={answer.id}
                  accessibilityLabel={accessibilityLabel}
                  label={answer.label}
                  value={answer.value?.toString()}
                  placeholder={answer.placeholder}
                  keyboardType="numeric"
                  labelStyle={styles.labelStyle}
                  renderErrorMessage={!!answer.errorMessage}
                  errorMessage={answer.errorMessage}
                  onChangeText={(value) => setAnswer(answer.id, value, questionIdx)}
                />
              );
            })}
          </View>
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
  questionContainer: {
    marginBottom: 30,
  },
  question: {
    marginBottom: 20,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  labelStyle: {
    color: '#000000',
  },
  button: {
    marginTop: 20,
  },
});
