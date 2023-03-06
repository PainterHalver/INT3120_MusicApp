/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Hello from './screens/Hello';
import NewApp from './screens/NewApp';

const Stack = createNativeStackNavigator<RootStackParamList>();

// https://reactnavigation.org/docs/typescript/#type-checking-screens
export type RootStackParamList = {
  Hello: undefined;
  Welcome: undefined;
};

function App(): JSX.Element {
  useEffect(() => {
    console.log('Hello World!');
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Hello"
          component={Hello}
          options={{title: 'Hello Screen', headerShown: false}}
        />
        <Stack.Screen
          name="Welcome"
          component={NewApp}
          options={{
            title: 'Welcome Screen',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});

export default App;
