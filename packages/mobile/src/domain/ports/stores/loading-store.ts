export const LoadingStoreToken = Symbol.for('LoadingStore');

export interface LoadingStore {
  setLoading: (loading: boolean) => void;
}
