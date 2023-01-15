import { CarbonFootprintDto, getTypedObjectKeys, NumberFormatter } from 'carbon-cut-commons';
import { injectable } from 'inversify';
import { SimulationResultsPresenter, SimulationResultsViewModel } from '../../domain/ports/presenters/simulation-results.presenter';
import { selectSimulationResults } from '../../infrastructure/store/selectors/simulation-selectors';

type KeyLabelMapperKeys = keyof Omit<CarbonFootprintDto, 'total'>;

@injectable()
export class WebSimulationResultsPresenter implements SimulationResultsPresenter {
  get viewModel(): SimulationResultsViewModel {
    const results = selectSimulationResults();
    const total = NumberFormatter.roundNumber(results?.total ?? 0, 2);
    return {
      carbonFootprint: `${total.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} kgCO2e / an` ?? '',
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
          formatter: this.#tooltipFormatter(results),
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
            data: [{ value: total, name: 'Alimentation', itemStyle: { color: '#57B349' } }],
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

  #tooltipFormatter(carbonFootprintDto: CarbonFootprintDto | undefined): string {
    if (!carbonFootprintDto) {
      return '';
    }
    const keyLabelMapper: Record<KeyLabelMapperKeys, string> = {
      breakfast: 'Petit déj.',
      hotBeverages: 'Boissons chaudes',
    };
    const { total, breakfast, hotBeverages } = carbonFootprintDto;

    const categories = getTypedObjectKeys({ breakfast, hotBeverages }).map((carbonFootprintKey) => {
      const footprintItem = carbonFootprintDto[carbonFootprintKey];
      if (footprintItem) {
        const footprint = typeof footprintItem === 'number' ? footprintItem : footprintItem.total;
        if (footprint) {
          const percentage = NumberFormatter.roundNumber((footprint / total) * 100, 2);
          return `<div>${keyLabelMapper[carbonFootprintKey]} : ${footprint} (${percentage} %)</div>`;
        }
      }
    });

    return categories.join('');
  }
}
