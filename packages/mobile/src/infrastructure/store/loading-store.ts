import { injectable } from 'inversify';
import { LoadingStore } from '../../domain/ports/stores/loading-store';
import { setIsLoading } from './actions/loading-actions';
import { appStore } from './app-store';

@injectable()
export class ReduxLoadingStore implements LoadingStore {
  setLoading(loading: boolean): void {
    appStore.dispatch(setIsLoading(loading));
  }
}
