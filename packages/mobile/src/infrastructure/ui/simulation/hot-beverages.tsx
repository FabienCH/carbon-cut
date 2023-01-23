import { Button, Text, Input } from '@rneui/themed';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { HotBeveragesKeys, WebHotBeveragesQuestionPresenter } from '../../../adapters/presenters/web-hot-beverages-question.presenter';
import { Answer, HotBeveragesQuestionPresenterToken } from '../../../domain/ports/presenters/question.presenter';
import { diContainer } from '../../inversify.config';
import { SaveSimulationAnswerUseCase, SaveSimulationAnswerUseCaseToken } from '../../../domain/usecases/save-simulation-answer.usecase';
import { RootStackParamList, Routes } from '../../root-navigation';
import { NavigationProp } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { selectIsLoading } from '../../store/selectors/loading-selectors';

type HotBeveragesAnswer = Answer<HotBeveragesKeys, number | null>;
type HotBeveragesNavigationProp = NavigationProp<RootStackParamList, Routes.HotBeveragesAnswer>;

export default function HotBeveragesAnswer({ navigation }: { navigation: HotBeveragesNavigationProp }) {
  const [presenter] = useState<WebHotBeveragesQuestionPresenter>(
    diContainer.get<WebHotBeveragesQuestionPresenter>(HotBeveragesQuestionPresenterToken),
  );
  const [saveSimulationAnswerUseCase] = useState<SaveSimulationAnswerUseCase>(
    diContainer.get<SaveSimulationAnswerUseCase>(SaveSimulationAnswerUseCaseToken),
  );
  const isLoading = useSelector(selectIsLoading);

  const [answers, updateAnswers] = useState<HotBeveragesAnswer[]>(presenter.viewModel.questions[0].answers);
  const [nextNavigateRoute, setNextNavigateRoute] = useState<Routes>(presenter.nextNavigateRoute());
  const { viewModel } = presenter;

  const setAnswer = (key: HotBeveragesKeys, value: string): void => {
    presenter.setAnswer({ key, value });
    setNextNavigateRoute(presenter.nextNavigateRoute());
    updateAnswers(viewModel.questions[0].answers);
  };

  const submitButtonPressed = (): void => {
    saveSimulationAnswerUseCase.execute({ answerKey: 'hotBeverages', answer: presenter.simulationBeverages() });
    navigation.navigate(nextNavigateRoute);
  };

  return (
    <View style={styles.container}>
      <Text accessibilityRole="header" style={styles.question}>
        {viewModel.questions[0].question}
      </Text>
      {answers.map((answer) => {
        const accessibilityLabel = `Entrez le nombre de ${answer.label} par semaine`;
        return (
          <Input
            key={answer.id}
            accessibilityLabel={accessibilityLabel}
            label={answer.label}
            value={answer.value?.toString()}
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
        onPress={() => submitButtonPressed()}
      >
        Suivant
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
