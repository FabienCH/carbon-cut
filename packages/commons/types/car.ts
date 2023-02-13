export type FuelType = 'Diesel' | 'EssenceE10' | 'EssenceE85';
export type EngineType = 'thermal' | 'hybrid' | 'electric';

export type CarAnswer = {
  km: number;
  engineType: EngineType;
  fuelType?: FuelType;
  fuelConsumption?: number;
};
