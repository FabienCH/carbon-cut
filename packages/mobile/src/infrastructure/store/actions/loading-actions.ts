import { createAction } from '@reduxjs/toolkit';

export const setIsLoading = createAction<boolean>('Set Is Loading');

export type LoadingActionTypes = typeof setIsLoading;
