import { Text } from '@rneui/base';
import { Button, Chip } from '@rneui/themed';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AnswerVM, BreakfastQuestionPresenter } from '../../../adapters/presenters/breakfast-question.presenter';

const presenter: BreakfastQuestionPresenter = new BreakfastQuestionPresenter();

export default function Breakfast() {
  const [answers, updateAnswers] = useState<AnswerVM[]>(presenter.answers);

  const setSelectedAnswer = (answer: AnswerVM): void => {
    presenter.setSelectedAnswer(answer.value);
    updateAnswers(presenter.answers);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{presenter.question}</Text>
      {answers.map((answer) => {
        const type = answer.selected ? 'solid' : 'outline';
        return (
          <Chip
            title={answer.label}
            key={answer.value}
            containerStyle={styles.answer}
            type={type}
            onPress={() => setSelectedAnswer(answer)}
          />
        );
      })}
      <Button containerStyle={styles.button}>Calculer mon empreinte</Button>
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
