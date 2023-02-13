import { CarAnswer, TransportDto, TransportFootprintDto } from 'carbon-cut-commons';
import { FuelTypeData, TransportData } from '../../types/transport-types';
import { FootprintHelper } from '../footprints-helper';

export class Transport {
  readonly #car: CarAnswer;
  readonly #transportData: TransportData;

  constructor(transportDto: TransportDto, transportData: TransportData) {
    const { car } = transportDto;
    this.#car = car;
    this.#transportData = transportData;
  }

  calculateYearlyFootprint(): TransportFootprintDto {
    const fuelConsumptionPerLiter = (this.#car.fuelConsumption ?? 0) / 100;
    const fuelTypeKey = `car${this.#car.fuelType ?? 'Diesel'}ByLiter` as FuelTypeData;
    console.log('this.#transportData.footprints[fuelTypeKey]', this.#transportData.footprints[fuelTypeKey]);
    console.log('this.#car.km', this.#car.km);
    const car = this.#car.km * this.#transportData.footprints[fuelTypeKey] * fuelConsumptionPerLiter;
    console.log('car FOOTPRINT', car);

    return { ...FootprintHelper.removeNullishFootprints({ car }), total: car };
  }

  // #getTotal(numbers: number[], nullableNumbers: Array<number | undefined>): number {
  //   const cleanedNullableNumbers = nullableNumbers.filter((number) => !isNaN(number));
  //   return NumberFormatter.roundNumber(
  //     [...numbers, ...cleanedNullableNumbers].reduce((acc, val) => acc + val, 0),
  //     3,
  //   );
  // }
}
