import 'reflect-metadata';
import { render, screen } from '@testing-library/react-native';
import SimulationResults from './simulation-results';
import { setCarbonFootprint } from '../../adapters/simulation-results/store/actions/simulation-actions';
import MockTheme from '../../tests/theme-mock';
import { appStore } from '../../adapters/commons/store/app-store';

describe('SimulationResults component', () => {
  it('should display carbon footprint simulation results with less than 1t footprint', () => {
    appStore.dispatch(
      setCarbonFootprint({
        alimentation: {
          breakfast: 603.354,
          meals: { total: 0 },
          total: 603.354,
        },
        transport: { total: 0 },
      }),
    );
    render(
      <MockTheme>
        <SimulationResults containerStyle={{}} />
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
        alimentation: {
          breakfast: 603.354,
          hotBeverages: {
            coffee: 173.5,
            tea: 35.45,
            hotChocolate: 305.6,
            total: 519.95,
          },
          meals: { total: 0 },
          total: 1123.304,
        },
        transport: { total: 0 },
      }),
    );
    render(
      <MockTheme>
        <SimulationResults containerStyle={{}} />
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
        alimentation: {
          breakfast: 1013.354,
          hotBeverages: {
            coffee: 173.5,
            tea: 35.45,
            hotChocolate: 305.6,
            total: 519.95,
          },
          coldBeverages: {
            sweet: 73.5,
            total: 73.5,
          },
          meals: { total: 0 },
          total: 1606.804,
        },
        transport: { total: 0 },
      }),
    );
    render(
      <MockTheme>
        <SimulationResults containerStyle={{}} />
      </MockTheme>,
    );

    const pieChart = screen.getByTestId('SIMULATION_RESULTS').children[2];
    const tooltip = pieChart.props.option.tooltip;
    expect(tooltip.formatter).toEqual(
      '<div>Petit déj. : 1.01t (63.1 %)</div><div>Boissons chaudes : 520kg (32.4 %)</div><div>Boissons froides : 74kg (4.6 %)</div>',
    );
  });
});
