export const SimulationResultsPresenterToken = Symbol.for('SimulationResultsPresenter');

export interface SimulationResultsViewModel {
  carbonFootprint: string;
  chartOption: object;
}

export interface SimulationResultsPresenter {
  viewModel: SimulationResultsViewModel;
}
