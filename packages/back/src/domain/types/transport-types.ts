export enum FuelTypeData {
  carDieselByLiter = 'carDieselByLiter',
  carEssenceE10ByLiter = 'carEssenceE10ByLiter',
  carEssenceE85byLiter = 'carEssenceE85ByLiter',
}

export enum ElectricTypeData {
  smallElectricalCarByKm = 'smallElectricalCarByKm',
  mediumElectricalCarByKm = 'mediumElectricalCarByKm',
  largeElectricalCarByKm = 'largeElectricalCarByKm',
}

export type TransportDataFootprints = {
  [FuelTypeData.carDieselByLiter]: number;
  [FuelTypeData.carEssenceE10ByLiter]: number;
  [FuelTypeData.carEssenceE85byLiter]: number;
  [ElectricTypeData.smallElectricalCarByKm]: number;
  [ElectricTypeData.mediumElectricalCarByKm]: number;
  [ElectricTypeData.largeElectricalCarByKm]: number;
};

export type TransportDataMultipliers = {
  carHybridReduction: number;
};

export interface TransportData {
  footprints: TransportDataFootprints;
  multipliers: TransportDataMultipliers;
}
