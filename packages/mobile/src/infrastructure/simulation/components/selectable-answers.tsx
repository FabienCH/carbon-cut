import { Chip } from '@rneui/themed';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Answer } from '@domain/ports/presenters/question.presenter';

interface SelectableAnswersProps<T> {
  answers: Answer<T>[];
  answerSelected: (answer: Answer<T>) => void;
}

export default function SelectableAnswers<T extends string>({ answers, answerSelected }: SelectableAnswersProps<T>) {
  const [selectedAnswer, updateSelectedAnswer] = useState<T | undefined>();

  const onSelectAnswer = (answer: Answer<T>) => {
    answerSelected(answer);
    updateSelectedAnswer(answer.value);
  };

  return (
    <View style={styles.container}>
      {answers.map((answer) => {
        const type = answer.value === selectedAnswer ? 'solid' : 'outline';
        return (
          <Chip
            accessibilityRole="radio"
            title={answer.label}
            key={answer.value}
            containerStyle={styles.answer}
            type={type}
            onPress={() => onSelectAnswer(answer)}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  answer: {
    marginVertical: 5,
  },
});
