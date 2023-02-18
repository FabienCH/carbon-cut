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
}
