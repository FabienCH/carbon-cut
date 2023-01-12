import 'reflect-metadata';
import { render, screen } from '@testing-library/react-native';
import SimulationResults from './simulation-results';
import { appStore } from '../../store/app-store';
import { setCarbonFootprint } from '../../store/actions/simulation-actions';
import MockTheme from '../../../tests/theme-mock';

describe('SimulationResults component', () => {
  beforeEach(() => {
    appStore.dispatch(setCarbonFootprint({ breakfast: 5.354, total: 5.354 }));

    render(
      <MockTheme>
        <SimulationResults />
      </MockTheme>,
    );
  });

  it('should display carbon footprint simulation results', () => {
    const expectedChartData = [{ value: 5.354, name: 'Alimentation', itemStyle: { color: '#57B349' } }];
    const results = screen.getByRole('text');
    const resultsTextContent = results.props.children[0];
    const pieChart = screen.getByTestId('SIMULATION_RESULTS').children[2];

    expect(resultsTextContent).toEqual('5,35 kgCO2e / an');
    expect(pieChart.props.option.series[0].data).toEqual(expectedChartData);
  });
});
