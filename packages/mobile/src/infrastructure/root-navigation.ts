import { createNavigationContainerRef } from '@react-navigation/native';
import { StyleProp, ViewStyle } from 'react-native';
import 'reflect-metadata';
import { styles } from './app/style';

export enum Routes {
  Home = 'Home',
  Breakfast = 'Breakfast',
  HotBeverages = 'HotBeverages',
  ColdBeverages = 'ColdBeverages',
  MilkType = 'MilkType',
  Meals = 'Meals',
  CarKmType = 'CarKmType',
  FuelCarConsumption = 'FuelCarConsumption',
  ElectricCarSize = 'ElectricCarSize',
  SimulationResults = 'SimulationResults',
}

export type RootStackParamList = Record<keyof typeof Routes, { containerStyle: StyleProp<ViewStyle> }>;

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigate(name: keyof RootStackParamList) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, { containerStyle: styles.container });
  }
}
