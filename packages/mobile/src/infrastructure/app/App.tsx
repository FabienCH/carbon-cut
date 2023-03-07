import React from 'react';
import { ThemeProvider } from '@rneui/themed';
import { theme } from './theme';
import Home from '../home/home';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { navigationRef, RootStackParamList, Routes } from '../root-navigation';
import { RootSiblingParent } from 'react-native-root-siblings';
import { styles } from './style';
import { Provider } from 'react-redux';
import { appStore } from '../../adapters/commons/store/app-store';
import SimulationResults from '../simulation-results/simulation-results';
import Breakfast from '../simulation/pages/alimentation/breakfast';
import ColdBeverages from '../simulation/pages/alimentation/cold-beverages';
import HotBeverages from '../simulation/pages/alimentation/hot-beverages';
import MilkType from '../simulation/pages/alimentation/milk-type';
import Meals from '../simulation/pages/alimentation/meals';
import CarKmType from '../simulation/pages/transport/car-km-type';
import FuelCarConsumption from '../simulation/pages/transport/fuel-car-consumption';
import ElectricCarSize from '../simulation/pages/transport/electric-car-size';

const Stack = createNativeStackNavigator<RootStackParamList>();

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
                <Stack.Screen name={Routes.Home}>{(props) => <Home {...props} containerStyle={styles.container} />}</Stack.Screen>
                <Stack.Screen name={Routes.Breakfast}>{(props) => <Breakfast {...props} containerStyle={styles.container} />}</Stack.Screen>
                <Stack.Screen name={Routes.HotBeverages}>
                  {(props) => <HotBeverages {...props} containerStyle={styles.container} />}
                </Stack.Screen>
                <Stack.Screen name={Routes.MilkType}>{(props) => <MilkType {...props} containerStyle={styles.container} />}</Stack.Screen>
                <Stack.Screen name={Routes.ColdBeverages}>
                  {(props) => <ColdBeverages {...props} containerStyle={styles.container} />}
                </Stack.Screen>
                <Stack.Screen name={Routes.Meals}>{(props) => <Meals {...props} containerStyle={styles.container} />}</Stack.Screen>
                <Stack.Screen name={Routes.CarKmType}>{(props) => <CarKmType {...props} containerStyle={styles.container} />}</Stack.Screen>
                <Stack.Screen name={Routes.FuelCarConsumption}>
                  {(props) => <FuelCarConsumption {...props} containerStyle={styles.container} />}
                </Stack.Screen>
                <Stack.Screen name={Routes.ElectricCarSize}>
                  {(props) => <ElectricCarSize {...props} containerStyle={styles.container} />}
                </Stack.Screen>
                <Stack.Screen name={Routes.SimulationResults}>
                  {(props) => <SimulationResults {...props} containerStyle={styles.container} />}
                </Stack.Screen>
              </Stack.Navigator>
            </NavigationContainer>
          </RootSiblingParent>
        </ThemeProvider>
      </Provider>
    </React.StrictMode>
  );
}
