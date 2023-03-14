import 'reflect-metadata';
import { render, screen } from '@testing-library/react-native';
import SimulationResults from './simulation-results';
import { setCarbonFootprint } from '@adapters/simulation-results/store/actions/simulation-actions';
import MockTheme from '@tests/theme-mock';
import { appStore } from '@adapters/commons/store/app-store';

type ExpectedData = { value: number; tooltipFormater: string; labelFormater: string };

describe('SimulationResults component', () => {
  it('should display carbon footprint simulation results with tooltip for less than 1t footprint', () => {
    appStore.dispatch(
      setCarbonFootprint({
        alimentation: {
          breakfast: 603.354,
          meals: { total: 0 },
          total: 603.354,
        },
        transport: { total: 105, car: 105 },
        total: 708.354,
      }),
    );
    render(
      <MockTheme>
        <SimulationResults containerStyle={{}} />
      </MockTheme>,
    );

    const results = screen.getByRole('text');
    const resultsTextContent = results.props.children[0];
    const pieChart = screen.getByTestId('SIMULATION_RESULTS').children[2];

    const expectedChartData = getExpectedChartData({
      alimentation: { value: 603.354, tooltipFormater: '<div>Petit déj. : 603kg (100 %)</div>', labelFormater: '603kg' },
      transport: { value: 105, tooltipFormater: '<div>Voiture : 105kg (100 %)</div>', labelFormater: '105kg' },
    });
    expect(resultsTextContent).toEqual('708 kgCO2e / an');
    expect(pieChart.props.option.series[0].data).toEqual(expectedChartData);
  });

  it('should display carbon footprint simulation results with tooltip for more than 1t footprint', () => {
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
        transport: { total: 278.25, car: 278.25 },
        total: 1401.554,
      }),
    );
    render(
      <MockTheme>
        <SimulationResults containerStyle={{}} />
      </MockTheme>,
    );

    const results = screen.getByRole('text');
    const resultsTextContent = results.props.children[0];
    const pieChart = screen.getByTestId('SIMULATION_RESULTS').children[2];

    const expectedChartData = getExpectedChartData({
      alimentation: {
        value: 1123.304,
        tooltipFormater: '<div>Petit déj. : 603kg (53.7 %)</div><div>Boissons chaudes : 520kg (46.3 %)</div>',
        labelFormater: '1.12t',
      },
      transport: { value: 278.25, tooltipFormater: '<div>Voiture : 278kg (100 %)</div>', labelFormater: '278kg' },
    });
    expect(resultsTextContent).toEqual('1,4 tCO2e / an');
    expect(pieChart.props.option.series[0].data).toEqual(expectedChartData);
  });

  function getExpectedChartData({ alimentation, transport }: { alimentation: ExpectedData; transport: ExpectedData }) {
    return [
      {
        value: alimentation.value,
        name: 'Alimentation',
        itemStyle: { color: '#57B349' },
        tooltip: {
          formatter: alimentation.tooltipFormater,
        },
        label: {
          normal: {
            formatter: `${alimentation.labelFormater}\n({d}%)`,
          },
        },
      },
      {
        value: transport.value,
        name: 'Transport',
        itemStyle: { color: '#BF4545' },
        tooltip: {
          formatter: transport.tooltipFormater,
        },
        label: {
          normal: {
            formatter: `${transport.labelFormater}\n({d}%)`,
          },
        },
      },
    ];
  }
});
