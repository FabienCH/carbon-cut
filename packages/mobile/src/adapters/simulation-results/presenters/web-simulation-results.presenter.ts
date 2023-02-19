import { AlimentationFootprintDto, getTypedObjectKeys, NumberFormatter } from 'carbon-cut-commons';
import { injectable } from 'inversify';
import { SimulationResultsPresenter, SimulationResultsViewModel } from '../../../domain/ports/presenters/simulation-results.presenter';
import { selectSimulationResults } from '../store/selectors/simulation-selectors';

type KeyLabelMapperKeys = keyof Omit<AlimentationFootprintDto, 'total'>;

@injectable()
export class WebSimulationResultsPresenter implements SimulationResultsPresenter {
  get viewModel(): SimulationResultsViewModel {
    const results = selectSimulationResults();
    const total = this.#formatFootprintValue(results?.alimentation.total);
    const weightUnit = this.#getWeightUnit(results?.alimentation.total);
    return {
      carbonFootprint: `${total.toLocaleString('fr-FR')} ${weightUnit}CO2e / an` ?? '',
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
          formatter: this.#tooltipFormatter(results?.alimentation),
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
                formatter: `{c}${weightUnit}\n({d}%)`,
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

  #tooltipFormatter(alimentationFootprintDto: AlimentationFootprintDto | undefined): string {
    if (!alimentationFootprintDto) {
      return '';
    }
    const keyLabelMapper: Record<KeyLabelMapperKeys, string> = {
      breakfast: 'Petit déj.',
      hotBeverages: 'Boissons chaudes',
      coldBeverages: 'Boissons froides',
      meals: 'Repas',
    };
    const { total, breakfast, hotBeverages, coldBeverages, meals } = alimentationFootprintDto;

    const categories = getTypedObjectKeys({ breakfast, hotBeverages, coldBeverages, meals }).map((carbonFootprintKey) => {
      const footprintItem = alimentationFootprintDto[carbonFootprintKey];
      if (footprintItem) {
        const footprintValue = typeof footprintItem === 'number' ? footprintItem : footprintItem.total;
        if (footprintValue) {
          const percentage = this.#formatPercentage(footprintValue / total);
          const footprint = this.#formatFootprintValue(footprintValue);
          const weightUnit = this.#getWeightUnit(footprintValue);

          return `<div>${keyLabelMapper[carbonFootprintKey]} : ${footprint}${weightUnit} (${percentage} %)</div>`;
        }
      }
    });

    return categories.join('');
  }

  #getWeightUnit(weight: number | undefined) {
    return weight && weight < 1000 ? 'kg' : 't';
  }

  #formatFootprintValue(value: number | undefined): number {
    if (!value) {
      return 0;
    }

    if (value < 1000) {
      return NumberFormatter.roundNumber(value, 0);
    }

    return NumberFormatter.roundNumber(value / 1000, 2);
  }

  #formatPercentage(value: number | undefined): number {
    if (!value) {
      return 0;
    }

    return NumberFormatter.roundNumber(value * 100, 1);
  }
}
