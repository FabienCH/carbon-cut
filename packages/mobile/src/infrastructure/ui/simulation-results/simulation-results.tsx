import { Colors, Theme } from '@rneui/base';
import { Dimensions, StyleSheet, View } from 'react-native';
import { WebSimulationResultsPresenter } from '../../../adapters/presenters/web-simulation-results.presenter';
import { SimulationResultsPresenterToken } from '../../../domain/ports/presenters/simulation-results.presenter';
import { diContainer } from '../../inversify.config';
import { Text, useTheme } from '@rneui/themed';
import RNEChartsPro from 'react-native-echarts-pro';

export default function SimulationResults() {
  const presenter: WebSimulationResultsPresenter = diContainer.get<WebSimulationResultsPresenter>(SimulationResultsPresenterToken);
  const { theme } = useTheme();
  const { width, height } = Dimensions.get('window');
  const chartHeight = Math.min(width, height) - 40;

  return (
    <View testID="SIMULATION_RESULTS" style={styles.container}>
      <Text accessibilityRole="header" style={styles.title}>
        Votre empreinte carbon actuelle :
      </Text>
      <Text style={footprintStyles(theme).title}>{presenter.viewModel.results} </Text>
      <RNEChartsPro height={chartHeight} option={presenter.viewModel.chartOption} />
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

const footprintStyles = (
  theme: {
    colors: Colors;
  } & Theme,
) =>
  StyleSheet.create({
    title: { fontSize: 26, marginBottom: 20, fontWeight: 'bold', textAlign: 'center', color: theme.colors.primary },
  });
