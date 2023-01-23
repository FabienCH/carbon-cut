import { Chip } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import { SelectableAnswer } from '../../../../domain/ports/presenters/question.presenter';

interface SelectableAnswersProps<T> {
  answers: SelectableAnswer<T>[];
  answerSelected: (answer: SelectableAnswer<T>) => void;
}

export default function SelectableAnswers<T extends string>({ answers, answerSelected }: SelectableAnswersProps<T>) {
  return (
    <View>
      {answers.map((answer) => {
        const type = answer.selected ? 'solid' : 'outline';
        return (
          <Chip
            accessibilityRole="radio"
            title={answer.label}
            key={answer.value}
            containerStyle={styles.answer}
            type={type}
            onPress={() => answerSelected(answer)}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  answer: {
    marginVertical: 5,
  },
});
