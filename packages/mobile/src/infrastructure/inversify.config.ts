import { BreakfastTypes } from 'carbon-cut-commons';
import { Container } from 'inversify';
import 'reflect-metadata';
import { WebBreakfastQuestionPresenter } from '../adapters/presenters/web-breakfast-question.presenter';
import { WebSimulationResultsPresenter } from '../adapters/presenters/web-simulation-results.presenter';
import { RestCarbonFootprintRepository } from '../adapters/repositories/rest-carbon-footprint.repository';
import { BreakfastQuestionPresenterToken, QuestionPresenter } from '../domain/ports/presenters/question.presenter';
import { SimulationResultsPresenter, SimulationResultsPresenterToken } from '../domain/ports/presenters/simulation-results.presenter';
import { CarbonFootprintRepository, CarbonFootprintRepositoryToken } from '../domain/ports/repositories/carbon-footprint.repository';
import { SimulationStore, SimulationStoreToken } from '../domain/ports/stores/simulation-store';
import {
  CarbonFootprintSimulationUseCase,
  CarbonFootprintSimulationUseCaseToken,
} from '../domain/usecases/carbon-footprint-simulation.usescase';
import { ReduxSimulationStore } from './store/simulation-store';

const diContainer = new Container();

diContainer.bind<QuestionPresenter<BreakfastTypes>>(BreakfastQuestionPresenterToken).to(WebBreakfastQuestionPresenter);
diContainer.bind<SimulationResultsPresenter>(SimulationResultsPresenterToken).to(WebSimulationResultsPresenter);
diContainer.bind<CarbonFootprintRepository>(CarbonFootprintRepositoryToken).to(RestCarbonFootprintRepository);
diContainer.bind<CarbonFootprintSimulationUseCase>(CarbonFootprintSimulationUseCaseToken).to(CarbonFootprintSimulationUseCase);
diContainer.bind<SimulationStore>(SimulationStoreToken).to(ReduxSimulationStore);

export { diContainer };
