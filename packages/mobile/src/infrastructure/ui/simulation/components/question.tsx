import { Text } from '@rneui/base';
import { StyleSheet, View } from 'react-native';

interface QuestionProps {
  question: string;
  children: JSX.Element;
}

export default function Question({ children, question }: QuestionProps) {
  return (
    <View style={styles.container}>
      <Text accessibilityRole="header" style={styles.question}>
        {question}
      </Text>
      {children}
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
    marginBottom: 20,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
