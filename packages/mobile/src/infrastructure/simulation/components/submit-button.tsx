import { Button } from '@rneui/themed';
import { StyleSheet } from 'react-native';

interface SubmitButtonProps {
  canSubmit: boolean;
  isLastQuestion: boolean;
  isLoading?: boolean;
  nextButtonClicked: () => void;
}

export default function SubmitButton({ canSubmit, isLastQuestion, isLoading, nextButtonClicked }: SubmitButtonProps) {
  return (
    <Button
      accessibilityRole="button"
      containerStyle={styles.button}
      disabled={!canSubmit}
      loading={isLoading}
      onPress={() => nextButtonClicked()}
    >
      {isLastQuestion ? 'Calculer mon empreinte' : 'Suivant'}
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
  },
});
