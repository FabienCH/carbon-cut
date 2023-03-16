import { TransportFootprint } from '@domain/types/carbon-footprint';
import { TransportAnswers } from '@domain/types/simulation-answers';
import { TransportData } from '../../types/transport-types';
import { FootprintHelper } from '../footprints-helper';
import { Car } from './car';

export class Transport {
  readonly #car: Car;

  constructor(transportAnswers: TransportAnswers, transportData: TransportData) {
    const { car } = transportAnswers;
    this.#car = new Car(transportData, car);
  }

  calculateYearlyFootprint(): TransportFootprint {
    const { car, total } = this.#car.calculateYearlyFootprint();

    return { ...FootprintHelper.removeNullishFootprints({ car }), total };
  }
}
