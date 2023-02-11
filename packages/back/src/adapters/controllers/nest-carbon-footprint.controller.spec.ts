import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { BreakfastTypes } from 'carbon-cut-commons';
import * as request from 'supertest';
import { SimulationDataRepositoryToken } from '../../domain/ports/repositories/simulation-data.repository';
import { CalculateCarbonFootprintUseCase } from '../../domain/usecases/calculate-carbon-footprint.usecase';
import { InMemorySimulationDataRepository } from '../../tests/repositories/in-memory-simulation-data.repository';
import { defaultAlimentationAnswers, defaultSimulationAnswers } from '../../tests/simulation-answers';
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

      expectBadRequestError(response, ['alimentation should not be empty']);
    });

    it('should not accept request with empty alimentation', async () => {
      const response = await getResponse({ alimentation: {} });

      expectBadRequestError(response, [
        'alimentation.breakfast must be one of the following values: continentalBreakfast, milkCerealBreakfast, britishBreakfast, veganBreakfast, noBreakfast',
        'alimentation.breakfast should not be empty',
        'alimentation.hotBeverages should not be empty',
        'alimentation.coldBeverages should not be empty',
        'alimentation.meals should not be empty',
      ]);
    });

    it('should not accept request with empty cold beverages', async () => {
      const response = await getResponse({
        ...defaultSimulationAnswers,
        alimentation: { ...defaultAlimentationAnswers, coldBeverages: {} },
      });

      expectBadRequestError(response, [
        'alimentation.coldBeverages.sweet must be a number conforming to the specified constraints',
        'alimentation.coldBeverages.sweet should not be empty',
        'alimentation.coldBeverages.alcohol must be a number conforming to the specified constraints',
        'alimentation.coldBeverages.alcohol should not be empty',
      ]);
    });

    it('should not accept request with empty hot beverages', async () => {
      const response = await getResponse({
        ...defaultSimulationAnswers,
        alimentation: { ...defaultAlimentationAnswers, hotBeverages: {} },
      });

      expectBadRequestError(response, [
        'alimentation.hotBeverages.coffee must be a number conforming to the specified constraints',
        'alimentation.hotBeverages.coffee should not be empty',
        'alimentation.hotBeverages.tea must be a number conforming to the specified constraints',
        'alimentation.hotBeverages.tea should not be empty',
        'alimentation.hotBeverages.hotChocolate must be a number conforming to the specified constraints',
        'alimentation.hotBeverages.hotChocolate should not be empty',
      ]);
    });

    it('should not accept request with invalid milk type', async () => {
      const response = await getResponse({
        ...defaultSimulationAnswers,
        alimentation: { ...defaultAlimentationAnswers, milkType: 'some type' },
      });

      expectBadRequestError(response, ['alimentation.milkType must be one of the following values: cowMilk, sojaMilk, oatsMilk']);
    });

    it('should not accept request with no milk type if milk cereal breakfast or hot chocolate', async () => {
      const response = await getResponse({
        ...defaultSimulationAnswers,
        alimentation: {
          ...defaultAlimentationAnswers,
          breakfast: BreakfastTypes.milkCerealBreakfast,
          hotBeverages: { coffee: 1, tea: 2, hotChocolate: 3 },
          coldBeverages: { sweet: 1, alcohol: 2 },
        },
      });

      expectBadRequestError(response, ['Milk type should not be empty with cereal milk breakfast']);
    });

    it('should not accept request with negative values', async () => {
      const response = await getResponse({
        ...defaultSimulationAnswers,
        alimentation: { ...defaultAlimentationAnswers, hotBeverages: { coffee: -1, tea: -2, hotChocolate: -3 } },
      });

      expectBadRequestError(response, [
        'hotBeverages.coffee must be positive, -1 given',
        'hotBeverages.tea must be positive, -2 given',
        'hotBeverages.hotChocolate must be positive, -3 given',
      ]);
    });

    it('should not accept request with a number of meals not equals to 14', async () => {
      const response = await getResponse({
        ...defaultSimulationAnswers,
        alimentation: {
          ...defaultAlimentationAnswers,
          meals: { vegan: 2, vegetarian: 2, whiteMeat: 2, redMeat: 2, whiteFish: 2, fish: 3 },
        },
      });

      expectBadRequestError(response, ['The number of meals must be 14, 13 given']);
    });
  });
});
