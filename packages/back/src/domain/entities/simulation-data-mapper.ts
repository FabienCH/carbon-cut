import { DataRecord } from './data-record';

enum QuantitiesMapping {
  coffeePerCup = 'alimentation . boisson . tasse de café . quantité café par tasse',
  teaPerCup = 'alimentation . boisson . tasse de thé . quantité thé par tasse',
}

type AlimentationQuantities = {
  [quantityKey in keyof typeof QuantitiesMapping]: number;
};

enum FootprintsMapping {
  groundedCoffee = 'alimentation . boisson . tasse de café . empreinte café moulu',
  infusedTea = 'alimentation . boisson . tasse de thé . empreinte thé infusé',
}

type AlimentationFootprints = {
  [footprintKey in keyof typeof FootprintsMapping]: number;
};

export interface AlimentationData {
  quantities: AlimentationQuantities;
  footprints: AlimentationFootprints;
}

export class SimulationDataMapper {
  mapAlimentationData(alimentation: DataRecord): AlimentationData {
    return {
      quantities: this.mapObject(alimentation, QuantitiesMapping),
      footprints: this.mapObject(alimentation, FootprintsMapping),
    };
  }

  private mapObject<T>(alimentation: DataRecord, mappingObject: typeof QuantitiesMapping | typeof FootprintsMapping): T {
    return Object.keys(mappingObject).reduce((quantitiesAcc, quantityKey): T => {
      const alimentationKey = mappingObject[quantityKey as keyof typeof mappingObject];
      const formule = alimentation[alimentationKey]?.formule;

      if (typeof formule === 'number') {
        quantitiesAcc = { ...quantitiesAcc, [quantityKey]: formule };
      }

      return quantitiesAcc;
    }, {} as T);
  }
}
