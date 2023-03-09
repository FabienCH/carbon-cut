import { Colors, Theme } from '@rneui/base';
import { Dimensions, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Text, useTheme } from '@rneui/themed';
import RNEChartsPro from 'react-native-echarts-pro';
import { useState } from 'react';
import { WebSimulationResultsPresenter } from '@adapters/simulation-results/presenters/web-simulation-results.presenter';
import { SimulationResultsPresenterToken } from '@domain/ports/presenters/simulation-results.presenter';
import { diContainer } from '../inversify.config';

export default function SimulationResults({ containerStyle }: { containerStyle: StyleProp<ViewStyle> }) {
  const [presenter] = useState<WebSimulationResultsPresenter>(
    diContainer.get<WebSimulationResultsPresenter>(SimulationResultsPresenterToken),
  );
  const { theme } = useTheme();
  const { width, height } = Dimensions.get('window');
  const chartHeight = Math.min(width, height) - 40;

  return (
    <View testID="SIMULATION_RESULTS" style={containerStyle}>
      <Text accessibilityRole="header" style={styles.title}>
        Votre empreinte carbone actuelle :
      </Text>
      <Text style={footprintStyles(theme).title}>{presenter.viewModel.carbonFootprint} </Text>
      <RNEChartsPro height={chartHeight} option={presenter.viewModel.chartOption} />
    </View>
  );
}

const styles = StyleSheet.create({
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
