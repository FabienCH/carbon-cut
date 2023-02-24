import { BreakfastTypes, ColdBeveragesAnswer, HotBeveragesAnswer, MealsAnswer, MilkTypes } from 'carbon-cut-commons';
import { Container } from 'inversify';
import 'reflect-metadata';
import { ReactToastUserNotifyPresenter } from '../adapters/commons/presenters/react-toast-user-notify.presenter';
import { ReduxLoadingStore } from '../adapters/commons/store/loading-store';
import { RestCarbonFootprintGateway } from '../adapters/simulation-results/gateways/rest-carbon-footprint.gateway';
import { WebSimulationResultsPresenter } from '../adapters/simulation-results/presenters/web-simulation-results.presenter';
import { ReduxSimulationStore } from '../adapters/simulation-results/store/simulation-store';
import { WebBreakfastQuestionPresenter } from '../adapters/simulation/presenters/alimentation/web-breakfast-question.presenter';
import { WebColdBeveragesQuestionPresenter } from '../adapters/simulation/presenters/alimentation/web-cold-beverages-question.presenter';
import { WebHotBeveragesQuestionPresenter } from '../adapters/simulation/presenters/alimentation/web-hot-beverages-question.presenter';
import { WebMealsQuestionPresenter } from '../adapters/simulation/presenters/alimentation/web-meals-question.presenter';
import { WebMilkTypeQuestionPresenter } from '../adapters/simulation/presenters/alimentation/web-milk-type-question.presenter';
import { WebCarKmTypeQuestionPresenter } from '../adapters/simulation/presenters/transport/web-car-km-type-question.presenter';
import { WebFuelCarConsumptionQuestionPresenter } from '../adapters/simulation/presenters/transport/web-fuel-car-consumption-question.presenter';
import { CarbonFootprintGateway, CarbonFootprintGatewayToken } from '../domain/ports/gateways/carbon-footprint.gateway';
import {
  BreakfastQuestionPresenterToken,
  CarKmTypeQuestionPresenterToken,
  ColdBeveragesQuestionPresenterToken,
  FuelCarConsumptionQuestionPresenterToken,
  HotBeveragesQuestionPresenterToken,
  InputQuestionPresenter,
  MealsQuestionPresenterToken,
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
import { SetInputAnswerUseCase, SetInputAnswerUseCaseToken } from '../domain/usecases/set-input-answer.usecase';
import { theme } from './app/theme';

const diContainer = new Container();

diContainer.bind<SelectableQuestionPresenter<BreakfastTypes>>(BreakfastQuestionPresenterToken).to(WebBreakfastQuestionPresenter);
diContainer.bind<InputQuestionPresenter<HotBeveragesAnswer>>(HotBeveragesQuestionPresenterToken).to(WebHotBeveragesQuestionPresenter);
diContainer.bind<SelectableQuestionPresenter<MilkTypes>>(MilkTypeQuestionPresenterToken).to(WebMilkTypeQuestionPresenter);
diContainer.bind<InputQuestionPresenter<ColdBeveragesAnswer>>(ColdBeveragesQuestionPresenterToken).to(WebColdBeveragesQuestionPresenter);
diContainer.bind<InputQuestionPresenter<MealsAnswer>>(MealsQuestionPresenterToken).to(WebMealsQuestionPresenter);
diContainer.bind<WebCarKmTypeQuestionPresenter>(CarKmTypeQuestionPresenterToken).to(WebCarKmTypeQuestionPresenter);
diContainer
  .bind<WebFuelCarConsumptionQuestionPresenter>(FuelCarConsumptionQuestionPresenterToken)
  .to(WebFuelCarConsumptionQuestionPresenter);
diContainer.bind<SimulationResultsPresenter>(SimulationResultsPresenterToken).to(WebSimulationResultsPresenter);
diContainer.bind<UserNotifyPresenter>(UserNotifyPresenterToken).to(ReactToastUserNotifyPresenter);
diContainer.bind<Record<string, string | undefined>>(UserNotifyConfigToken).toConstantValue({ backgroundColor: theme.darkColors?.error });

diContainer.bind<CarbonFootprintGateway>(CarbonFootprintGatewayToken).to(RestCarbonFootprintGateway);

diContainer.bind<CarbonFootprintSimulationUseCase>(CarbonFootprintSimulationUseCaseToken).to(CarbonFootprintSimulationUseCase);
diContainer.bind<SaveSimulationAnswerUseCase>(SaveSimulationAnswerUseCaseToken).to(SaveSimulationAnswerUseCase);
diContainer.bind<SetInputAnswerUseCase>(SetInputAnswerUseCaseToken).to(SetInputAnswerUseCase);

diContainer.bind<SimulationStore>(SimulationStoreToken).to(ReduxSimulationStore);
diContainer.bind<LoadingStore>(LoadingStoreToken).to(ReduxLoadingStore);

export { diContainer };
