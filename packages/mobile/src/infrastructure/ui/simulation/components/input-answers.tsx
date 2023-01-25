import { Input } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import { Answer } from '../../../../domain/ports/presenters/question.presenter';

interface InputAnswersProps<T extends string> {
  answers?: Answer<T, any>[];
  answerChanged: (key: T, value: string) => void;
}

export default function InputAnswers<T extends string>({ answers, answerChanged }: InputAnswersProps<T>) {
  return answers ? (
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
            labelStyle={styles.labelStyle}
            renderErrorMessage={!!answer.errorMessage}
            errorMessage={answer.errorMessage}
            onChangeText={(value) => answerChanged(answer.id, value)}
          />
        );
      })}
    </View>
  ) : null;
}

const styles = StyleSheet.create({
  labelStyle: {
    color: '#000000',
  },
});
