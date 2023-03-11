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
import {
  NavigationContainer,
  NavigatorScreenParams,
} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import TrackPlayer, {State} from 'react-native-track-player';
import type {Track} from 'react-native-track-player';

import Hello from './screens/Hello';
import NewApp from './screens/NewApp';
import Player from './screens/Player';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

// https://reactnavigation.org/docs/typescript/#type-checking-screens
export type BottomTabParamList = {
  Hello: undefined;
  Welcome: undefined;
};

export type RootStackParamList = {
  Home: NavigatorScreenParams<BottomTabParamList>;
  Player: undefined;
};

const tracks: Track[] = [
  {
    id: 1,
    url: require('./assets/Gnarls-Barkley-Crazy.mp3'),
    title: 'Crazy',
  },
  {
    id: 2,
    url: require('./assets/Thang-Tu-La-Loi-Noi-Doi-Cua-Em-Ha-Anh-Tuan.mp3'),
    title: 'Thang Tu La Loi Noi Doi Cua Em',
  },
];

function App(): JSX.Element {
  useEffect(() => {
    const setUpTrackPlayer = async () => {
      try {
        // If TrackPlayer is already initialized, skip
        if (!(await TrackPlayer.isServiceRunning())) {
          await TrackPlayer.setupPlayer();
        }
        await TrackPlayer.reset();
        await TrackPlayer.add(tracks);
        console.log('Tracks: ', await TrackPlayer.getQueue());
        TrackPlayer.play();
      } catch (e) {
        console.log(e);
      }
    };

    setUpTrackPlayer();
  }, []);

  const Home = () => {
    return (
      <BottomTab.Navigator>
        <BottomTab.Screen
          name="Hello"
          component={Hello}
          options={{
            title: 'Hello',
            headerShown: false,
            tabBarIcon: ({focused, color, size}) => (
              <FontAwesomeIcon name="sun-o" size={size} color={color} />
            ),
          }}
        />
        <BottomTab.Screen
          name="Welcome"
          component={NewApp}
          options={{
            title: 'Welcome',
            headerShown: false,
            tabBarIcon: ({focused, color, size}) => (
              <MaterialCommunityIcon name="new-box" size={size} color={color} />
            ),
          }}
        />
      </BottomTab.Navigator>
    );
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{headerShown: false}}
        />
        <Stack.Screen name="Player" component={Player} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});

export default App;
