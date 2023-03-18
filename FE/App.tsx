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
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
} from 'react-native-track-player';
import type {Track} from 'react-native-track-player';

import Hello from './screens/Hello';
import NewApp from './screens/NewApp';
import Player from './screens/Player';
import {TransitionSpec} from '@react-navigation/stack/lib/typescript/src/types';
import {Easing} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

// https://reactnavigation.org/docs/typescript/#type-checking-screens
export type BottomTabParamList = {
  Hello: undefined;
  Welcome: undefined;
};

export type RootStackParamList = {
  Home: NavigatorScreenParams<BottomTabParamList>;
  Player: undefined;
};

// Cần artwork để hiện trong thông báo hoặc lock screen
const tracks: Track[] = [
  {
    id: 1,
    url: require('./assets/Gnarls-Barkley-Crazy.mp3'),
    title: 'Crazy',
    artist: 'Gnarls Barkley',
    artwork: require('./assets/Gnarls-Barkley-Crazy.jpg'),
  },
  {
    id: 2,
    url: require('./assets/Thang-Tu-La-Loi-Noi-Doi-Cua-Em-Ha-Anh-Tuan.mp3'),
    title: 'Thang Tu La Loi Noi Doi Cua Em',
    artist: 'Ha Anh Tuan',
    artwork: require('./assets/Thang-Tu-La-Loi-Noi-Doi-Cua-Em-Ha-Anh-Tuan.jpg'),
  },
];

function App(): JSX.Element {
  useEffect(() => {
    const setUpTrackPlayer = async () => {
      try {
        // If TrackPlayer is already initialized, skip
        if (!(await TrackPlayer.isServiceRunning())) {
          await TrackPlayer.setupPlayer({});
          await TrackPlayer.updateOptions({
            android: {
              appKilledPlaybackBehavior:
                AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
            },
            capabilities: [
              Capability.Play,
              Capability.Pause,
              Capability.SkipToNext,
              Capability.SkipToPrevious,
              // Capability.Stop,
              Capability.SeekTo,
              // Capability.JumpForward,
              // Capability.JumpBackward,
            ],
            progressUpdateEventInterval: 1,
          });
          console.log('TrackPlayer is initialized');
        }
        await TrackPlayer.reset();
        await TrackPlayer.add(tracks);
        console.log(`Added ${tracks.length} tracks`);
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
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Player"
            component={Player}
            options={{
              headerShown: false,
              // ...TransitionPresets.ModalPresentationIOS, // TransitionPresets.ModalSlideFromBottomIOS
              ...TransitionPresets.ModalSlideFromBottomIOS,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
