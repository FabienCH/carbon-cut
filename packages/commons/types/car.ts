import { CarSize, EngineType, FuelType } from './transport-enums';

export type CarAnswer = {
  km: number;
  engineType: EngineType;
  fuelType?: FuelType;
  fuelConsumption?: number;
  carSize?: CarSize;
};
