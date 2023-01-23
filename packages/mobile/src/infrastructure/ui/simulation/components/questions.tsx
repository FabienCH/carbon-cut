import { Text } from '@rneui/base';
import { Button } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';

interface QuestionProps {
  questions: string[];
  canSubmit: boolean;
  children: JSX.Element | JSX.Element[];
  nextButtonClicked: () => {};
}

export default function Questions({ children, questions, canSubmit, nextButtonClicked }: QuestionProps) {
  return (
    <View style={styles.container}>
      {questions.map((question, questionIdx) => {
        return (
          <View key={questionIdx} style={styles.questionContainer}>
            <Text accessibilityRole="header" style={styles.question}>
              {question}
            </Text>
          </View>
        );
      })}
      {children}
      <Button accessibilityRole="button" containerStyle={styles.button} disabled={canSubmit} onPress={() => nextButtonClicked()}>
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
  questionContainer: {
    marginBottom: 30,
  },
  question: {
    marginBottom: 20,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
  },
});
