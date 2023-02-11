import { BreakfastTypes, getTypedObjectKeys } from 'carbon-cut-commons';
import {
  AlimentationData,
  AlimentationDataFootprints,
  AlimentationDataMultipliers,
  AlimentationDataQuantities,
  AlimentationFootprintsMappingType,
} from '../types/alimentation-types';
import { DataRecord } from '../types/data-record';
import { TransportData, TransportDataFootprints, TransportDataMultipliers } from '../types/transport-types';
import { AlimentationFootprintsMapping, MultipliersMapping, QuantitiesMapping } from './alimentation/alimentation-data-mapping';
import { TransportFootprintsMapping, TransportMultipliersMapping } from './transport/transport-data-mapping';

import { Formula } from './formula';

export class SimulationDataSourceMapper {
  mapAlimentationData(alimentation: DataRecord): AlimentationData {
    return {
      quantities: this.#mapAlimentationObject<AlimentationDataQuantities>(alimentation, QuantitiesMapping),
      footprints: this.#mapAlimentationObject<AlimentationDataFootprints>(alimentation, AlimentationFootprintsMapping, {
        [BreakfastTypes.noBreakfast]: 0,
      }),
      multipliers: this.#mapAlimentationObject<AlimentationDataMultipliers>(alimentation, MultipliersMapping),
    };
  }

  mapTransportData(transport: DataRecord): TransportData {
    return {
      footprints: this.#mapTransportObject<TransportDataFootprints>(transport, TransportFootprintsMapping),
      multipliers: this.#mapTransportObject<TransportDataMultipliers>(transport, TransportMultipliersMapping),
    };
  }

  #mapTransportObject<T>(transport: DataRecord, mappingObject: typeof TransportFootprintsMapping | typeof TransportMultipliersMapping): T {
    return getTypedObjectKeys(mappingObject).reduce((acc, key): T => {
      const dataKey = mappingObject[key];
      if (transport[dataKey]?.formule) {
        const formula = new Formula(transport[dataKey].formule);
        const value = formula.getMappedTransportValue(dataKey);
        if (value) {
          acc = { ...acc, ...value };
        }
      }
      return acc;
    }, {} as T);
  }

  #mapAlimentationObject<T>(
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
