export type TransportDataFootprints = {
  carDieselByLiter: number;
  carEssenceE10ByLiter: number;
  essenceE85byLiter: number;
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
