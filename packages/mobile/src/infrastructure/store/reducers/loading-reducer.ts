import { createReducer } from '@reduxjs/toolkit';
import { setIsLoading } from '../actions/loading-actions';

export type LoadingState = boolean;

const initialState: LoadingState = false;

export const loadingReducer = createReducer(initialState, (builder) => {
  builder.addCase(setIsLoading, (_, { payload }) => payload).addDefaultCase((state) => state);
});
