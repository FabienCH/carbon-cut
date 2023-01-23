import { BreakfastTypes, MilkTypes } from 'carbon-cut-commons';
import { Container } from 'inversify';
import 'reflect-metadata';
import { RestCarbonFootprintGateway } from '../adapters/gateways/rest-carbon-footprint.gateway';
import { ReactToastUserNotifyPresenter } from '../adapters/presenters/react-toast-user-notify.presenter';
import { WebBreakfastQuestionPresenter } from '../adapters/presenters/simulation/web-breakfast-question.presenter';
import { WebColdBeveragesQuestionPresenter } from '../adapters/presenters/simulation/web-cold-beverages-question.presenter';
import { WebHotBeveragesQuestionPresenter } from '../adapters/presenters/simulation/web-hot-beverages-question.presenter';
import { WebMilkTypeQuestionPresenter } from '../adapters/presenters/simulation/web-milk-type-question.presenter';
import { WebSimulationResultsPresenter } from '../adapters/presenters/web-simulation-results.presenter';
import { CarbonFootprintGateway, CarbonFootprintGatewayToken } from '../domain/ports/gateways/carbon-footprint.gateway';
import {
  BreakfastQuestionPresenterToken,
  ColdBeveragesQuestionPresenterToken,
  HotBeveragesQuestionPresenterToken,
  MilkTypeQuestionPresenterToken,
  QuestionPresenter,
} from '../domain/ports/presenters/question.presenter';
import { SimulationResultsPresenter, SimulationResultsPresenterToken } from '../domain/ports/presenters/simulation-results.presenter';
import { UserNotifyPresenter, UserNotifyPresenterToken } from '../domain/ports/presenters/user-notify.presenter';
import { LoadingStore, LoadingStoreToken } from '../domain/ports/stores/loading-store';
import { SimulationStore, SimulationStoreToken } from '../domain/ports/stores/simulation-store';
import {
  CarbonFootprintSimulationUseCase,
  CarbonFootprintSimulationUseCaseToken,
} from '../domain/usecases/carbon-footprint-simulation.usescase';
import { SaveSimulationAnswerUseCase, SaveSimulationAnswerUseCaseToken } from '../domain/usecases/save-simulation-answer.usecase';
import { ReduxLoadingStore } from './store/loading-store';
import { ReduxSimulationStore } from './store/simulation-store';

const diContainer = new Container();

diContainer.bind<QuestionPresenter<BreakfastTypes>>(BreakfastQuestionPresenterToken).to(WebBreakfastQuestionPresenter);
diContainer.bind<QuestionPresenter<number | string>>(HotBeveragesQuestionPresenterToken).to(WebHotBeveragesQuestionPresenter);
diContainer.bind<QuestionPresenter<MilkTypes>>(MilkTypeQuestionPresenterToken).to(WebMilkTypeQuestionPresenter);
diContainer.bind<QuestionPresenter<number | string>>(ColdBeveragesQuestionPresenterToken).to(WebColdBeveragesQuestionPresenter);
diContainer.bind<SimulationResultsPresenter>(SimulationResultsPresenterToken).to(WebSimulationResultsPresenter);
diContainer.bind<UserNotifyPresenter>(UserNotifyPresenterToken).to(ReactToastUserNotifyPresenter);

diContainer.bind<CarbonFootprintGateway>(CarbonFootprintGatewayToken).to(RestCarbonFootprintGateway);

diContainer.bind<CarbonFootprintSimulationUseCase>(CarbonFootprintSimulationUseCaseToken).to(CarbonFootprintSimulationUseCase);
diContainer.bind<SaveSimulationAnswerUseCase>(SaveSimulationAnswerUseCaseToken).to(SaveSimulationAnswerUseCase);

diContainer.bind<SimulationStore>(SimulationStoreToken).to(ReduxSimulationStore);
diContainer.bind<LoadingStore>(LoadingStoreToken).to(ReduxLoadingStore);

export { diContainer };
