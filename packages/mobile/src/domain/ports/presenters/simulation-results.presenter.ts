export const SimulationResultsPresenterToken = Symbol.for('SimulationResultsPresenter');

export interface SimulationResultsViewModel {
  results: string;
  chartOption: object;
}

export interface SimulationResultsPresenter {
  viewModel: SimulationResultsViewModel;
}
