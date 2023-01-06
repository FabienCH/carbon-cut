import { BreakfastTypes } from 'carbon-cut-types';
import { Container } from 'inversify';
import 'reflect-metadata';
import { BreakfastQuestionPresenter } from '../../adapters/presenters/breakfast-question.presenter';
import { RestCarbonFootprintRepository } from '../../adapters/repositories/rest-carbon-footprint.repository';
import { QuestionPresenter } from '../../domain/ports/presenters/question.presenter';
import { CarbonFootprintRepository } from '../../domain/ports/repositories/carbon-footprint.repository';
import { CarbonFootprintSimulationUseCase } from '../../domain/usecases/carbon-footprint-simulation.usescase';
import { TYPES } from './inversify-types';

const diContainer = new Container();
diContainer.bind<QuestionPresenter<BreakfastTypes>>(TYPES.BreakfastQuestionPresenter).to(BreakfastQuestionPresenter);
diContainer.bind<CarbonFootprintRepository>(TYPES.CarbonFootprintRepository).to(RestCarbonFootprintRepository);
diContainer.bind<CarbonFootprintSimulationUseCase>(TYPES.CarbonFootprintSimulationUseCase).to(CarbonFootprintSimulationUseCase);

export { diContainer };
