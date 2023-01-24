import { Text } from '@rneui/base';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

interface QuestionProps {
  question: string;
  children: JSX.Element;
  style?: StyleProp<ViewStyle>;
}

export default function Question({ children, question, style }: QuestionProps) {
  return (
    <View style={style}>
      <Text accessibilityRole="header" style={styles.question}>
        {question}
      </Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  question: {
    marginBottom: 15,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
