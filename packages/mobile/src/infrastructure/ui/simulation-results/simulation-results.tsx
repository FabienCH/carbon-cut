import { Text } from '@rneui/base';
import { StyleSheet, View } from 'react-native';

export default function SimulationResults() {
  return (
    <View style={styles.container}>
      <Text accessibilityRole="header" style={styles.title}>
        Votre empreinte carbon actuelle
      </Text>
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
  title: {
    marginBottom: 10,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
