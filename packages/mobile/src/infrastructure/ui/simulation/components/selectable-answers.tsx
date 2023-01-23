import { Chip } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import { SelectableAnswer } from '../../../../domain/ports/presenters/question.presenter';

interface SelectableAnswersProps {
  answers: SelectableAnswer<any>[];
  answerSelected: (answer: SelectableAnswer<any>) => {};
}

export default function SelectableAnswers({ answers, answerSelected }: SelectableAnswersProps) {
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
