import { DataRecord } from './data-record';
import { Formula } from './formula';
import {
  AlimentationData,
  AlimentationFootprintsMapping,
  AlimentationFootprintsMappingType,
  MultipliersMapping,
  QuantitiesMapping,
} from './simulation-data';

export class SimulationDataSourceMapper {
  mapAlimentationData(alimentation: DataRecord): AlimentationData {
    return {
      quantities: this.mapObject(alimentation, QuantitiesMapping),
      footprints: this.mapObject(alimentation, AlimentationFootprintsMapping),
      multipliers: this.mapObject(alimentation, MultipliersMapping),
    };
  }

  private mapObject<T>(
    alimentation: DataRecord,
    mappingObject: AlimentationFootprintsMappingType | typeof QuantitiesMapping | typeof MultipliersMapping,
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
