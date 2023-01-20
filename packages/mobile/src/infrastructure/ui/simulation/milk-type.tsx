import { NavigationProp } from '@react-navigation/native';
import { Text } from '@rneui/base';
import { Button, Chip } from '@rneui/themed';
import { MilkTypes } from 'carbon-cut-commons';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { WebMilkTypeQuestionPresenter } from '../../../adapters/presenters/web-milk-type-question.presenter';
import { MilkTypeQuestionPresenterToken, SelectableAnswer } from '../../../domain/ports/presenters/question.presenter';
import { SaveSimulationAnswerUseCase, SaveSimulationAnswerUseCaseToken } from '../../../domain/usecases/save-simulation-answer.usecase';
import { diContainer } from '../../inversify.config';
import { RootStackParamList, Routes } from '../../root-navigation';
import { selectIsLoading } from '../../store/selectors/loading-selectors';

type MilkTypeAnswer = SelectableAnswer<MilkTypes>;
type MilkTypeNavigationProp = NavigationProp<RootStackParamList, Routes.MilkType>;

export default function MilkType({ navigation }: { navigation: MilkTypeNavigationProp }) {
  const [presenter] = useState<WebMilkTypeQuestionPresenter>(diContainer.get<WebMilkTypeQuestionPresenter>(MilkTypeQuestionPresenterToken));
  const [saveSimulationAnswerUseCase] = useState<SaveSimulationAnswerUseCase>(
    diContainer.get<SaveSimulationAnswerUseCase>(SaveSimulationAnswerUseCaseToken),
  );

  const [answers, updateAnswers] = useState<MilkTypeAnswer[]>(presenter.viewModel.answers);
  const { viewModel } = presenter;
  const isLoading = useSelector(selectIsLoading);

  const setSelectedMilkType = (answer: MilkTypeAnswer): void => {
    presenter.setAnswer(answer.value);
    updateAnswers(viewModel.answers);
  };

  const saveAnswer = (): void => {
    saveSimulationAnswerUseCase.execute({ answerKey: 'milkType', answer: viewModel.selectedAnswer });
    navigation.navigate(Routes.ColdBeverages);
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
            onPress={() => setSelectedMilkType(answer)}
          />
        );
      })}
      <Button
        accessibilityRole="button"
        containerStyle={styles.button}
        disabled={!viewModel.canSubmit}
        loading={isLoading}
        onPress={() => saveAnswer()}
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
