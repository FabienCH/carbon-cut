import React from 'react';
import { ThemeProvider } from '@rneui/themed';
import { theme } from './theme';
import Home from './home/home';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Breakfast from './simulation/breakfast';
import HotBeverages from './simulation/hot-beverages';
import SimulationResults from './simulation-results/simulation-results';
import { Provider } from 'react-redux';
import { appStore } from '../store/app-store';
import { navigationRef, Routes } from '../root-navigation';
import { RootSiblingParent } from 'react-native-root-siblings';
import MilkType from './simulation/milk-type';
import ColdBeverages from './simulation/cold-beverages';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <React.StrictMode>
      <Provider store={appStore}>
        <ThemeProvider theme={theme}>
          <RootSiblingParent>
            <NavigationContainer ref={navigationRef}>
              <Stack.Navigator
                screenOptions={{
                  headerShown: false,
                }}
              >
                <Stack.Screen name={Routes.Home} component={Home} />
                <Stack.Screen name={Routes.Breakfast} component={Breakfast} />
                <Stack.Screen name={Routes.HotBeverages} component={HotBeverages} />
                <Stack.Screen name={Routes.MilkType} component={MilkType} />
                <Stack.Screen name={Routes.ColdBeverages} component={ColdBeverages} />
                <Stack.Screen name={Routes.SimulationResults} component={SimulationResults} />
              </Stack.Navigator>
            </NavigationContainer>
          </RootSiblingParent>
        </ThemeProvider>
      </Provider>
    </React.StrictMode>
  );
}
