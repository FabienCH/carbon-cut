import React from 'react';
import { ThemeProvider } from '@rneui/themed';
import { theme } from './theme';
import Home from './home/home';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SimulationResults from './simulation-results/simulation-results';
import { Provider } from 'react-redux';
import { appStore } from '../store/app-store';
import { navigationRef, RootStackParamList, Routes } from '../root-navigation';
import { RootSiblingParent } from 'react-native-root-siblings';
import Breakfast from './simulation/pages/breakfast';
import ColdBeverages from './simulation/pages/cold-beverages';
import MilkType from './simulation/pages/milk-type';
import HotBeverages from './simulation/pages/hot-beverages';
import { styles } from './style';

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
