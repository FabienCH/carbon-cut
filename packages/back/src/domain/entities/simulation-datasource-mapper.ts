import { DataRecord } from './data-record';
import { Formula } from './formula';
import { AlimentationData, FootprintsMapping, MultipliersMapping, QuantitiesMapping } from './simulation-data';

export class SimulationDataSourceMapper {
  mapAlimentationData(alimentation: DataRecord): AlimentationData {
    return {
      quantities: this.mapObject(alimentation, QuantitiesMapping),
      footprints: this.mapObject(alimentation, FootprintsMapping),
      multipliers: this.mapObject(alimentation, MultipliersMapping),
    };
  }

  private mapObject<T>(
    alimentation: DataRecord,
    mappingObject: typeof QuantitiesMapping | typeof FootprintsMapping | typeof MultipliersMapping,
  ): T {
    return Object.keys(mappingObject).reduce((acc, key): T => {
      const alimentationKey = mappingObject[key as keyof typeof mappingObject];
      if (alimentation[alimentationKey]?.formule) {
        const formula = new Formula(alimentation[alimentationKey].formule);
        const value = formula.getMappedValue(key);
        if (value) {
          acc = { ...acc, ...value };
        }
      }

      return acc;
    }, {} as T);
  }
}
