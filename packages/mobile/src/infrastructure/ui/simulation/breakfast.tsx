import { NavigationProp } from '@react-navigation/native';
import { Text } from '@rneui/base';
import { Button, Chip } from '@rneui/themed';
import { BreakfastTypes, SimulationDto } from 'carbon-cut-commons';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebBreakfastQuestionPresenter } from '../../../adapters/presenters/web-breakfast-question.presenter';
import { SelectableAnswer, BreakfastQuestionPresenterToken } from '../../../domain/ports/presenters/question.presenter';
import { SaveSimulationAnswerUseCase, SaveSimulationAnswerUseCaseToken } from '../../../domain/usecases/save-simulation-answer.usecase';
import { diContainer } from '../../inversify.config';
import { RootStackParamList, Routes } from '../../root-navigation';

type BreakfastNavigationProp = NavigationProp<RootStackParamList, Routes.Breakfast>;
type BreakfastAnswer = SelectableAnswer<BreakfastTypes>;

export default function Breakfast({ navigation }: { navigation: BreakfastNavigationProp }) {
  const [presenter] = useState<WebBreakfastQuestionPresenter>(
    diContainer.get<WebBreakfastQuestionPresenter>(BreakfastQuestionPresenterToken),
  );
  const [saveSimulationAnswerUseCase] = useState<SaveSimulationAnswerUseCase>(
    diContainer.get<SaveSimulationAnswerUseCase>(SaveSimulationAnswerUseCaseToken),
  );
  const [answers, updateAnswers] = useState<BreakfastAnswer[]>(presenter.viewModel.answers);
  const { viewModel } = presenter;

  const setSelectedBreakfast = (answer: BreakfastAnswer): void => {
    presenter.setAnswer(answer.value);
    updateAnswers(viewModel.answers);
  };

  const saveAnswer = (): void => {
    saveSimulationAnswerUseCase.execute<Partial<SimulationDto>>({ breakfast: viewModel.selectedAnswer });
    navigation.navigate(Routes.HotBeverages);
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
      <Button accessibilityRole="button" containerStyle={styles.button} disabled={!viewModel.canSubmit} onPress={() => saveAnswer()}>
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
