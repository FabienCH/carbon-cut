import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { BreakfastTypes } from 'carbon-cut-commons';
import * as request from 'supertest';
import { SimulationDataRepositoryToken } from '../../domain/ports/repositories/simulation-data.repository';
import { CalculateCarbonFootprintUseCase } from '../../domain/usecases/calculate-carbon-footprint.usecase';
import { InMemorySimulationDataRepository } from '../../tests/repositories/in-memory-simulation-data.repository';
import { NestCarbonFootprintController } from './nest-carbon-footprint.controller';

describe('Carbon footprint calculation use case', () => {
  async function getResponse(body: object) {
    return await request(app.getHttpServer())
      .post('/carbon-footprint/calculate')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(body));
  }
  function expectBadRequestError(response: request.Response, message: string | string[], errorText = 'Bad Request') {
    const error = response.error as { text: string };
    const errorCause = errorText ? { error: errorText } : {};
    expect(response.status).toEqual(400);
    expect(JSON.parse(error.text)).toEqual({
      ...errorCause,
      statusCode: 400,
      message,
    });
  }

  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [NestCarbonFootprintController],
      providers: [
        CalculateCarbonFootprintUseCase,
        { provide: SimulationDataRepositoryToken, useValue: new InMemorySimulationDataRepository(true) },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('Carbon footprint controller', () => {
    it('should not accept empty request ', async () => {
      const response = await getResponse({});

      expectBadRequestError(response, [
        'breakfast must be one of the following values: continentalBreakfast, milkCerealBreakfast, britishBreakfast, veganBreakfast, noBreakfast',
        'breakfast should not be empty',
        'hotBeverages should not be empty',
        'coldBeverages should not be empty',
      ]);
    });

    it('should not accept request with empty cold beverages', async () => {
      const response = await getResponse({
        breakfast: BreakfastTypes.britishBreakfast,
        hotBeverages: { coffee: 1, tea: 2, hotChocolate: 3 },
        coldBeverages: {},
      });

      expectBadRequestError(response, [
        'coldBeverages.sweet must be a number conforming to the specified constraints',
        'coldBeverages.sweet should not be empty',
        'coldBeverages.alcohol must be a number conforming to the specified constraints',
        'coldBeverages.alcohol should not be empty',
      ]);
    });

    it('should not accept request with empty hot beverages', async () => {
      const response = await getResponse({
        breakfast: BreakfastTypes.veganBreakfast,
        hotBeverages: {},
        coldBeverages: { sweet: 1, alcohol: 2 },
      });

      expectBadRequestError(response, [
        'hotBeverages.coffee must be a number conforming to the specified constraints',
        'hotBeverages.coffee should not be empty',
        'hotBeverages.tea must be a number conforming to the specified constraints',
        'hotBeverages.tea should not be empty',
        'hotBeverages.hotChocolate must be a number conforming to the specified constraints',
        'hotBeverages.hotChocolate should not be empty',
      ]);
    });

    it('should not accept request with invalid milk type', async () => {
      const response = await getResponse({
        breakfast: BreakfastTypes.veganBreakfast,
        hotBeverages: { coffee: 1, tea: 2, hotChocolate: 3 },
        coldBeverages: { sweet: 1, alcohol: 2 },
        milkType: 'some type',
      });

      expectBadRequestError(response, ['milkType must be one of the following values: cowMilk, sojaMilk, oatsMilk']);
    });

    it('should not accept request with no milk type if milk cereal breakfast or hot chocolate', async () => {
      const response = await getResponse({
        breakfast: BreakfastTypes.milkCerealBreakfast,
        hotBeverages: { coffee: 1, tea: 2, hotChocolate: 3 },
        coldBeverages: { sweet: 1, alcohol: 2 },
      });

      expectBadRequestError(response, 'Milk type should not be empty with hot chocolate beverage', '');
    });
  });
});
