import { TransportDto, TransportFootprintDto } from 'carbon-cut-commons';
import { TransportData } from '../../types/transport-types';
import { FootprintHelper } from '../footprints-helper';
import { Car } from './car';

export class Transport {
  readonly #car: Car;

  constructor(transportDto: TransportDto, transportData: TransportData) {
    const { car } = transportDto;
    this.#car = new Car(transportData, car);
  }

  calculateYearlyFootprint(): TransportFootprintDto {
    const { car, total } = this.#car.calculateYearlyFootprint();

    return { ...FootprintHelper.removeNullishFootprints({ car }), total };
  }

  // #getTotal(numbers: number[], nullableNumbers: Array<number | undefined>): number {
  //   const cleanedNullableNumbers = nullableNumbers.filter((number) => !isNaN(number));
  //   return NumberFormatter.roundNumber(
  //     [...numbers, ...cleanedNullableNumbers].reduce((acc, val) => acc + val, 0),
  //     3,
  //   );
  // }
}
