import { Colors, Input, Theme, useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import { InputAnswer } from '@domain/ports/presenters/question.presenter';

interface InputAnswersProps<T extends string> {
  answers: InputAnswer<T>[];
  answerChanged: (value: string, key: T) => void;
}

export default function InputAnswers<T extends string>({ answers, answerChanged }: InputAnswersProps<T>) {
  const { theme } = useTheme();
  return (
    <View>
      {answers.map((answer) => {
        const accessibilityLabel = `Entrez le nombre de ${answer.label} par semaine`;
        return (
          <Input
            key={answer.id}
            accessibilityLabel={accessibilityLabel}
            label={answer.label}
            value={answer.value}
            placeholder={answer.placeholder}
            keyboardType="numeric"
            containerStyle={styles.answer}
            labelStyle={labelStyle(theme).label}
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
});

const labelStyle = (
  theme: {
    colors: Colors;
  } & Theme,
) =>
  StyleSheet.create({
    label: { color: theme.colors.primary },
  });
