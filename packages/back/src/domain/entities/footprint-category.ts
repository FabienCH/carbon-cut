import { NumberFormatter } from 'carbon-cut-commons';
import { AlimentationData, AlimentationDataQuantities } from '../types/alimentation-types';
import { TransportData } from '../types/transport-types';

export type WithoutTotal<T extends Record<string, number> & { total?: number }> = Omit<T, 'total'>;

export abstract class FootprintsCategory<
  Footprints extends Record<string, number> & { total?: number },
  Data extends AlimentationData | TransportData,
> {
  protected readonly footprintsData: Data['footprints'];
  protected readonly quantitiesData: AlimentationDataQuantities;

  protected footprint: WithoutTotal<Footprints>;

  constructor(footprintData: Data) {
    this.footprintsData = footprintData.footprints;
    if ('quantities' in footprintData) {
      this.quantitiesData = footprintData.quantities;
    }
  }

  protected calculateYearlyFootprintWithTotal(): WithoutTotal<Footprints> & { total: number } {
    const footprints = this.getYearlyFootprints();
    const totalFootprints = this.#getTotal(footprints);

    return { ...footprints, total: totalFootprints };
  }

  #getTotal(object: Record<string, number | undefined | never>): number {
    if (!object) {
      return 0;
    }
    return NumberFormatter.roundNumber(
      Object.values(object).reduce((acc, val) => acc + val, 0),
      3,
    );
  }

  abstract calculateYearlyFootprint(): Footprints;
  protected abstract getYearlyFootprints(): WithoutTotal<Footprints>;
}
