export enum FuelTypeData {
  carDieselByLiter = 'carDieselByLiter',
  carEssenceE10ByLiter = 'carEssenceE10ByLiter',
  carEssenceE85byLiter = 'carEssenceE85ByLiter',
}

export type TransportDataFootprints = {
  [FuelTypeData.carDieselByLiter]: number;
  [FuelTypeData.carEssenceE10ByLiter]: number;
  [FuelTypeData.carEssenceE85byLiter]: number;
  smallElectricalCarByKm: number;
  mediumElectricalCarByKm: number;
  largeElectricalCarByKm: number;
};

export type TransportDataMultipliers = {
  carHybridReduction: number;
};

export interface TransportData {
  footprints: TransportDataFootprints;
  multipliers: TransportDataMultipliers;
}
