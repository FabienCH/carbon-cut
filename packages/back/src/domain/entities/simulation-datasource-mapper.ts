import { BreakfastTypes } from 'carbon-cut-commons';
import { DataRecord } from './data-record';
import { Formula } from './formula';
import {
  AlimentationData,
  AlimentationFootprints,
  AlimentationFootprintsMapping,
  AlimentationFootprintsMappingType,
  AlimentationMultipliers,
  AlimentationQuantities,
  MultipliersMapping,
  QuantitiesMapping,
} from './simulation-data';

export class SimulationDataSourceMapper {
  mapAlimentationData(alimentation: DataRecord): AlimentationData {
    return {
      quantities: this.mapObject<AlimentationQuantities>(alimentation, QuantitiesMapping),
      footprints: this.mapObject<AlimentationFootprints>(alimentation, AlimentationFootprintsMapping, {
        [BreakfastTypes.noBreakfast]: 0,
      }),
      multipliers: this.mapObject<AlimentationMultipliers>(alimentation, MultipliersMapping),
    };
  }

  private mapObject<T>(
    alimentation: DataRecord,
    mappingObject: AlimentationFootprintsMappingType | typeof QuantitiesMapping | typeof MultipliersMapping,
    initialValue: Partial<T> = {},
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
    }, initialValue as T);
  }
}
