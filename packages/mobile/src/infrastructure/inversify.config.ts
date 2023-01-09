import { BreakfastTypes } from 'carbon-cut-types';
import { Container } from 'inversify';
import 'reflect-metadata';
import { BreakfastQuestionPresenter } from '../adapters/presenters/breakfast-question.presenter';
import { RestCarbonFootprintRepository } from '../adapters/repositories/rest-carbon-footprint.repository';
import { BreakfastQuestionPresenterToken, QuestionPresenter } from '../domain/ports/presenters/question.presenter';
import { CarbonFootprintRepository, CarbonFootprintRepositoryToken } from '../domain/ports/repositories/carbon-footprint.repository';
import { SimulationStore, SimulationStoreToken } from '../domain/ports/stores/simulation-store';
import {
  CarbonFootprintSimulationUseCase,
  CarbonFootprintSimulationUseCaseToken,
} from '../domain/usecases/carbon-footprint-simulation.usescase';
import { ReduxSimulationStore } from './store/simulation-store';

const diContainer = new Container();

diContainer.bind<QuestionPresenter<BreakfastTypes>>(BreakfastQuestionPresenterToken).to(BreakfastQuestionPresenter);
diContainer.bind<CarbonFootprintRepository>(CarbonFootprintRepositoryToken).to(RestCarbonFootprintRepository);
diContainer.bind<CarbonFootprintSimulationUseCase>(CarbonFootprintSimulationUseCaseToken).to(CarbonFootprintSimulationUseCase);
diContainer.bind<SimulationStore>(SimulationStoreToken).to(ReduxSimulationStore);

export { diContainer };
