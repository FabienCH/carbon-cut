import { BreakfastTypes, getTypedObjectKeys } from 'carbon-cut-commons';
import {
  AlimentationData,
  AlimentationDataFootprints,
  AlimentationDataMultipliers,
  AlimentationDataQuantities,
  AlimentationFootprintsMappingType,
} from '../types/alimentation-types';
import { DataRecord } from '../types/data-record';
import { AlimentationFootprintsMapping, MultipliersMapping, QuantitiesMapping } from './alimentation-data';

import { Formula } from './formula';

export class SimulationDataSourceMapper {
  mapAlimentationData(alimentation: DataRecord): AlimentationData {
    return {
      quantities: this.mapObject<AlimentationDataQuantities>(alimentation, QuantitiesMapping),
      footprints: this.mapObject<AlimentationDataFootprints>(alimentation, AlimentationFootprintsMapping, {
        [BreakfastTypes.noBreakfast]: 0,
      }),
      multipliers: this.mapObject<AlimentationDataMultipliers>(alimentation, MultipliersMapping),
    };
  }

  private mapObject<T>(
    alimentation: DataRecord,
    mappingObject: AlimentationFootprintsMappingType | typeof QuantitiesMapping | typeof MultipliersMapping,
    initialValue: Partial<T> = {},
  ): T {
    return getTypedObjectKeys(mappingObject).reduce((acc, key): T => {
      const alimentationKey = mappingObject[key];
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
