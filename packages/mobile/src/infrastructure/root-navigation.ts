import { createNavigationContainerRef } from '@react-navigation/native';
import 'reflect-metadata';

export enum Routes {
  Home = 'Home',
  Breakfast = 'Breakfast',
  HotBeverages = 'HotBeverages',
  MilkType = 'MilkType',
  SimulationResults = 'SimulationResults',
}

export type RootStackParamList = Record<keyof typeof Routes, undefined>;

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigate(name: keyof RootStackParamList) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name);
  }
}
