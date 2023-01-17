import 'reflect-metadata';
import { render, screen } from '@testing-library/react-native';
import SimulationResults from './simulation-results';
import { appStore } from '../../store/app-store';
import { setCarbonFootprint } from '../../store/actions/simulation-actions';
import MockTheme from '../../../tests/theme-mock';

describe('SimulationResults component', () => {
  it('should display carbon footprint simulation results with less than 1t footprint', () => {
    appStore.dispatch(
      setCarbonFootprint({
        breakfast: 603.354,
        total: 603.354,
      }),
    );
    render(
      <MockTheme>
        <SimulationResults />
      </MockTheme>,
    );

    const expectedChartData = [{ value: 603, name: 'Alimentation', itemStyle: { color: '#57B349' } }];
    const results = screen.getByRole('text');
    const resultsTextContent = results.props.children[0];
    const pieChart = screen.getByTestId('SIMULATION_RESULTS').children[2];

    expect(resultsTextContent).toEqual('603 kgCO2e / an');
    expect(pieChart.props.option.series[0].data).toEqual(expectedChartData);
  });

  it('should display carbon footprint simulation results with more than 1t footprint', () => {
    appStore.dispatch(
      setCarbonFootprint({
        breakfast: 603.354,
        hotBeverages: {
          coffee: 173.5,
          tea: 35.45,
          hotChocolate: 305.6,
          total: 519.95,
        },
        total: 1123.304,
      }),
    );
    render(
      <MockTheme>
        <SimulationResults />
      </MockTheme>,
    );

    const expectedChartData = [{ value: 1.12, name: 'Alimentation', itemStyle: { color: '#57B349' } }];
    const results = screen.getByRole('text');
    const resultsTextContent = results.props.children[0];
    const pieChart = screen.getByTestId('SIMULATION_RESULTS').children[2];

    expect(resultsTextContent).toEqual('1,12 tCO2e / an');
    expect(pieChart.props.option.series[0].data).toEqual(expectedChartData);
  });

  it('chart should have a tooltip that display footprint informations for each category', () => {
    appStore.dispatch(
      setCarbonFootprint({
        breakfast: 1013.354,
        hotBeverages: {
          coffee: 173.5,
          tea: 35.45,
          hotChocolate: 305.6,
          total: 519.95,
        },
        total: 1533.304,
      }),
    );
    render(
      <MockTheme>
        <SimulationResults />
      </MockTheme>,
    );

    const pieChart = screen.getByTestId('SIMULATION_RESULTS').children[2];
    const tooltip = pieChart.props.option.tooltip;
    expect(tooltip.formatter).toEqual('<div>Petit déj. : 1.01t (66.1 %)</div><div>Boissons chaudes : 520kg (33.9 %)</div>');
  });
});
