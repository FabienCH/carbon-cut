import { SimulationResultsPresenter, SimulationResultsViewModel } from '@domain/ports/presenters/simulation-results.presenter';
import { AlimentationFootprint, CarbonFootprint, TransportFootprint } from '@domain/types/carbon-footprint';
import { getTypedObjectKeys, NumberFormatter } from 'carbon-cut-commons';

import { injectable } from 'inversify';
import { selectSimulationResults } from '../store/selectors/simulation-selectors';

type KeyofWithoutTotal<T = AlimentationFootprint | TransportFootprint> = keyof Omit<T, 'total'>;

@injectable()
export class WebSimulationResultsPresenter implements SimulationResultsPresenter {
  readonly #labelMapper: Record<KeyofWithoutTotal<AlimentationFootprint & TransportFootprint>, string> = {
    breakfast: 'Petit déj.',
    hotBeverages: 'Boissons chaudes',
    coldBeverages: 'Boissons froides',
    meals: 'Repas',
    car: 'Voiture',
  };

  get viewModel(): SimulationResultsViewModel {
    const results = selectSimulationResults();
    const total = this.#formatFootprintValue(results?.total);
    const weightUnit = this.#getWeightUnit(results?.alimentation.total);
    const data = this.#getChartData(results);

    return {
      carbonFootprint: `${total.toLocaleString('fr-FR')} ${weightUnit}CO2e / an`,
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
            data,
            label: {
              normal: {
                show: true,
                position: 'inside',
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

  #getChartData(alimentationFootprint: CarbonFootprint | undefined) {
    if (!alimentationFootprint) {
      return [];
    }
    const { alimentation, transport } = alimentationFootprint;

    return [
      this.#getDataItem(alimentation, { name: 'Alimentation', color: '#57B349' }),
      this.#getDataItem(transport, { name: 'Transport', color: '#BF4545' }),
    ];
  }

  #getDataItem(footprint: AlimentationFootprint | TransportFootprint, itemConfig: { name: string; color: string }) {
    const { total } = footprint;
    const { name, color } = itemConfig;
    const formattedTotal = this.#formatFootprintValue(total);
    const weightUnit = this.#getWeightUnit(total);

    return {
      value: total,
      name,
      itemStyle: { color },
      label: {
        normal: {
          formatter: `${formattedTotal}${weightUnit}\n({d}%)`,
        },
      },
      tooltip: {
        formatter: this.#tooltipFormatter(footprint),
      },
    };
  }

  #tooltipFormatter(footprint: AlimentationFootprint | TransportFootprint): string {
    const { total, ...footprints } = footprint;
    const categories = getTypedObjectKeys(footprints).map((footprintKey) => {
      const footprintItem = footprint[footprintKey];
      const footprintValue = typeof footprintItem === 'number' ? footprintItem : (footprintItem as any).total;

      if (footprintValue) {
        const percentage = this.#formatPercentage(footprintValue / total);
        const formattedFootprint = this.#formatFootprintValue(footprintValue);
        const weightUnit = this.#getWeightUnit(footprintValue);

        return `<div>${this.#labelMapper[footprintKey]} : ${formattedFootprint}${weightUnit} (${percentage} %)</div>`;
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
