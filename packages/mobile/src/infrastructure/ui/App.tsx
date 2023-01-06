import React from 'react';
import { ThemeProvider } from '@rneui/themed';
import { theme } from './theme';
import Home from './home/home';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Breakfast from './simulation/breakfast';

const Stack = createNativeStackNavigator();

export type RootStackParamList = {
  Home: undefined;
  Breakfast: undefined;
};

export default function App() {
  return (
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Breakfast" component={Breakfast} />
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </React.StrictMode>
  );
}
