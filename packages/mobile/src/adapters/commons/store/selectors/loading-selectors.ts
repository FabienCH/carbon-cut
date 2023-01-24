import { AppState, appStore } from '../app-store';

export const selectIsLoadingState = (state: AppState) => state.loading;

export const selectIsLoading = (): boolean => selectIsLoadingState(appStore.getState());
