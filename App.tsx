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
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import TrackPlayer, {State} from 'react-native-track-player';
import type {Track} from 'react-native-track-player';

import Hello from './screens/Hello';
import NewApp from './screens/NewApp';

const Tab = createBottomTabNavigator<RootTabParamList>();

// https://reactnavigation.org/docs/typescript/#type-checking-screens
export type RootTabParamList = {
  Hello: undefined;
  Welcome: undefined;
};

const tracks: Track[] = [
  {
    id: 1,
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

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
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
        <Tab.Screen
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
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});

export default App;
