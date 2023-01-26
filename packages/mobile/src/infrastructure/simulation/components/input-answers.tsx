import { Input } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import { InputAnswer } from '../../../domain/ports/presenters/question.presenter';

interface InputAnswersProps<T extends string> {
  answers: InputAnswer<T>[];
  answerChanged: (value: string, key: T) => void;
}

export default function InputAnswers<T extends string>({ answers, answerChanged }: InputAnswersProps<T>) {
  return (
    <View>
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
            onChangeText={(value) => answerChanged(value, answer.id)}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  answer: {
    marginBottom: 20,
  },
  labelStyle: {
    color: '#000000',
  },
});
