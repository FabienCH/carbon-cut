import { injectable } from 'inversify';
import { SimulationResultsPresenter, SimulationResultsViewModel } from '../../domain/ports/presenters/simulation-results.presenter';
import { selectSimulationResults } from '../../infrastructure/store/selectors/simulation-selectors';

@injectable()
export class WebSimulationResultsPresenter implements SimulationResultsPresenter {
  get viewModel(): SimulationResultsViewModel {
    const results = selectSimulationResults() ?? 0;
    return {
      results: `${results.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} kgCO2e / an` ?? '',
      chartOption: {
        legend: {
          orient: 'horizontal',
          bottom: 'bottom',
          textStyle: {
            fontSize: 16,
          },
        },
        tooltip: {
          trigger: 'item',
          formatter: 'Petit déj. : {c}kg ({d}%)',
        },
        series: [
          {
            name: 'simulation-results',
            type: 'pie',
            hoverAnimation: true,
            avoidLabelOverlap: true,
            startAngle: 180,
            radius: [20, '85%'],
            center: ['50%', '45%'],
            data: [{ value: results, name: 'Alimentation', itemStyle: { color: '#57B349' } }],
            label: {
              normal: {
                show: true,
                position: 'inside',
                formatter: '{c}kg\n({d}%)',
                textStyle: {
                  fontSize: 14,
                  color: '#000000',
                },
              },
            },
          },
        ],
      },
    };
  }
}
