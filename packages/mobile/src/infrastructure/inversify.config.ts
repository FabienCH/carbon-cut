import { BreakfastTypes, ColdBeveragesAnswer, HotBeveragesAnswer, MilkTypes } from 'carbon-cut-commons';
import { Container } from 'inversify';
import 'reflect-metadata';
import { ReactToastUserNotifyPresenter } from '../adapters/commons/presenters/react-toast-user-notify.presenter';
import { ReduxLoadingStore } from '../adapters/commons/store/loading-store';
import { RestCarbonFootprintGateway } from '../adapters/simulation-results/gateways/rest-carbon-footprint.gateway';
import { WebSimulationResultsPresenter } from '../adapters/simulation-results/presenters/web-simulation-results.presenter';
import { ReduxSimulationStore } from '../adapters/simulation-results/store/simulation-store';
import { WebBreakfastQuestionPresenter } from '../adapters/simulation/presenters/web-breakfast-question.presenter';
import { WebColdBeveragesQuestionPresenter } from '../adapters/simulation/presenters/web-cold-beverages-question.presenter';
import { WebHotBeveragesQuestionPresenter } from '../adapters/simulation/presenters/web-hot-beverages-question.presenter';
import { WebMilkTypeQuestionPresenter } from '../adapters/simulation/presenters/web-milk-type-question.presenter';
import { CarbonFootprintGateway, CarbonFootprintGatewayToken } from '../domain/ports/gateways/carbon-footprint.gateway';
import {
  BreakfastQuestionPresenterToken,
  ColdBeveragesQuestionPresenterToken,
  HotBeveragesQuestionPresenterToken,
  InputQuestionPresenter,
  MilkTypeQuestionPresenterToken,
  SelectableQuestionPresenter,
} from '../domain/ports/presenters/question.presenter';
import { SimulationResultsPresenter, SimulationResultsPresenterToken } from '../domain/ports/presenters/simulation-results.presenter';
import { UserNotifyConfigToken, UserNotifyPresenter, UserNotifyPresenterToken } from '../domain/ports/presenters/user-notify.presenter';
import { LoadingStore, LoadingStoreToken } from '../domain/ports/stores/loading-store';
import { SimulationStore, SimulationStoreToken } from '../domain/ports/stores/simulation-store';
import {
  CarbonFootprintSimulationUseCase,
  CarbonFootprintSimulationUseCaseToken,
} from '../domain/usecases/carbon-footprint-simulation.usescase';
import { SaveSimulationAnswerUseCase, SaveSimulationAnswerUseCaseToken } from '../domain/usecases/save-simulation-answer.usecase';
import { theme } from './app/theme';

const diContainer = new Container();

diContainer.bind<SelectableQuestionPresenter<BreakfastTypes>>(BreakfastQuestionPresenterToken).to(WebBreakfastQuestionPresenter);
diContainer
  .bind<InputQuestionPresenter<number | string, HotBeveragesAnswer>>(HotBeveragesQuestionPresenterToken)
  .to(WebHotBeveragesQuestionPresenter);
diContainer.bind<SelectableQuestionPresenter<MilkTypes>>(MilkTypeQuestionPresenterToken).to(WebMilkTypeQuestionPresenter);
diContainer
  .bind<InputQuestionPresenter<number | string, ColdBeveragesAnswer>>(ColdBeveragesQuestionPresenterToken)
  .to(WebColdBeveragesQuestionPresenter);
diContainer.bind<SimulationResultsPresenter>(SimulationResultsPresenterToken).to(WebSimulationResultsPresenter);
diContainer.bind<UserNotifyPresenter>(UserNotifyPresenterToken).to(ReactToastUserNotifyPresenter);
diContainer.bind<Record<string, string | undefined>>(UserNotifyConfigToken).toConstantValue({ backgroundColor: theme.darkColors?.error });

diContainer.bind<CarbonFootprintGateway>(CarbonFootprintGatewayToken).to(RestCarbonFootprintGateway);

diContainer.bind<CarbonFootprintSimulationUseCase>(CarbonFootprintSimulationUseCaseToken).to(CarbonFootprintSimulationUseCase);
diContainer.bind<SaveSimulationAnswerUseCase>(SaveSimulationAnswerUseCaseToken).to(SaveSimulationAnswerUseCase);

diContainer.bind<SimulationStore>(SimulationStoreToken).to(ReduxSimulationStore);
diContainer.bind<LoadingStore>(LoadingStoreToken).to(ReduxLoadingStore);

export { diContainer };
