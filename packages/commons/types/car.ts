export type FuelType = 'Diesel' | 'EssenceE10' | 'EssenceE85';

export type CarAnswer = {
  km: number;
  fuelType?: FuelType;
  fuelConsumption?: number;
};
