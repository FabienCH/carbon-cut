import { CarAnswer, EngineType, TransportFootprintDto } from 'carbon-cut-commons';
import { ElectricTypeData, FuelTypeData, TransportData } from '../../types/transport-types';
import { AnswerValidator } from '../answer-validator';
import { FootprintsCategory } from '../footprint-category';
import { FootprintHelper } from '../footprints-helper';
import { ValidationError } from '../validation-error';

export class Car extends FootprintsCategory<
  {
    car?: number;
    total: number;
  },
  TransportData
> {
  #footprintDataKey: FuelTypeData | ElectricTypeData;
  #footprintMultiplier = 1;
  readonly #validationErrors: string[] = [];

  constructor(protected readonly transportData: TransportData, private readonly carAnswer: CarAnswer) {
    super(transportData);
    this.#validate();
    if (this.carAnswer.engineType === 'electric' && this.carAnswer.carSize) {
      this.#initElectricCar();
    } else {
      this.#initThermalOrHybridCar();
    }
  }

  calculateYearlyFootprint(): TransportFootprintDto {
    const { total, ...footprints } = this.calculateYearlyFootprintWithTotal();
    return { ...FootprintHelper.removeNullishFootprints(footprints), total };
  }

  protected getYearlyFootprints(): Partial<TransportFootprintDto> {
    const carFootprint = this.carAnswer.km * this.footprintsData[this.#footprintDataKey] * this.#footprintMultiplier;
    return { car: carFootprint };
  }

  #initElectricCar() {
    const carSize = this.carAnswer.carSize === 'sedan' || this.carAnswer.carSize === 'SUV' ? 'large' : this.carAnswer.carSize;
    const sizeCarDataKey = `${carSize}ElectricalCarByKm` as ElectricTypeData;
    this.#footprintDataKey = sizeCarDataKey;
  }

  #initThermalOrHybridCar() {
    const fuelTypeDataKey = `car${this.carAnswer.fuelType ?? 'Diesel'}ByLiter` as FuelTypeData;
    this.#footprintDataKey = fuelTypeDataKey;
    const fuelConsumptionPerLiter = (this.carAnswer.fuelConsumption ?? 0) / 100;
    const multiplier = this.carAnswer.engineType === 'hybrid' ? this.transportData.multipliers.carHybridReduction : 1;
    this.#footprintMultiplier = fuelConsumptionPerLiter * multiplier;
  }

  #validate(): void {
    AnswerValidator.validatePositiveValues({ km: this.carAnswer.km }, 'car');
    if (this.carAnswer.engineType === EngineType.electric) {
      this.#validateElectricalCar();
    } else {
      this.#validateFuelEngineCar();
    }
    if (this.#validationErrors.length) {
      throw new ValidationError(this.#validationErrors);
    }
  }

  #validateFuelEngineCar() {
    if (!this.carAnswer.fuelType) {
      this.#addValidationError('Fuel type');
    }
    if (!this.carAnswer.fuelConsumption) {
      this.#addValidationError('Fuel consumption');
    }
    AnswerValidator.validatePositiveValues({ fuelConsumption: this.carAnswer.fuelConsumption }, 'car');
  }

  #validateElectricalCar() {
    if (!this.carAnswer.carSize) {
      this.#addValidationError('Car size');
    }
  }

  #addValidationError(valueInError: string) {
    this.#validationErrors.push(`${valueInError} should not be empty with ${this.carAnswer.engineType} engine type`);
  }
}
