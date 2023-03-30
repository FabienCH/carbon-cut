import { QuestionIds } from '@domain/entites/questions-navigation';
import { createNavigationContainerRef } from '@react-navigation/native';
import { StyleProp, ViewStyle } from 'react-native';
import 'reflect-metadata';
import { styles } from './app/style';

export enum NonQuestionsRoutes {
  Home = 'Home',
  SimulationResults = 'SimulationResults',
}

export const AllRoutes = {
  ...QuestionIds,
  ...NonQuestionsRoutes,
};

export type Routes = QuestionIds | NonQuestionsRoutes;
export type Route<T extends keyof typeof QuestionIds | keyof typeof NonQuestionsRoutes> = T extends keyof QuestionIds
  ? QuestionIds[T]
  : T extends keyof NonQuestionsRoutes
  ? NonQuestionsRoutes[T]
  : never;

export type RootStackParamList = Record<Routes, { containerStyle: StyleProp<ViewStyle> }>;

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigate(name: keyof RootStackParamList) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, { containerStyle: styles.container });
  }
}
