/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {BottomTabBar, createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer, NavigatorScreenParams} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import React, {useEffect} from 'react';
import {TouchableNativeFeedback, View} from 'react-native';
import type {Track} from 'react-native-track-player';
import TrackPlayer, {AppKilledPlaybackBehavior, Capability} from 'react-native-track-player';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import {SafeAreaProvider} from 'react-native-safe-area-context';
import Hello from './src/screens/Hello';
import NewApp from './src/screens/NewApp';
import Player from './src/screens/Player';
// import PlaylistDetail from './src/screens/PlaylistDetail';
import MiniPlayer from './src/components/MiniPlayer';
import Search from './src/screens/Search';
import {PlayerProvider} from './src/contexts/PlayerContext';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

// https://reactnavigation.org/docs/typescript/#type-checking-screens
export type BottomTabParamList = {
  Hello: undefined;
  Search: undefined;
  Welcome: undefined;
};

export type RootStackParamList = {
  Home: NavigatorScreenParams<BottomTabParamList>;
  Player: undefined;
  PlaylistDetail: undefined;
};

// Cần artwork để hiện trong thông báo hoặc lock screen
export const tracks: Track[] = [
  {
    id: 1,
    url: require('./assets/Led_Zeppelin-Stairway_To_Heaven.mp3'),
    title: 'Stairway To Heaven',
    artist: 'Led Zeppelin',
    artwork: require('./assets/Led_Zeppelin-Stairway_To_Heaven.png'),
  },
  {
    id: 2,
    url: require('./assets/Gnarls-Barkley-Crazy.mp3'),
    title: 'Crazy',
    artist: 'Gnarls Barkley',
    artwork: require('./assets/Gnarls-Barkley-Crazy.jpg'),
  },
  {
    id: 3,
    url: require('./assets/Thang-Tu-La-Loi-Noi-Doi-Cua-Em-Ha-Anh-Tuan.mp3'),
    title: 'Thang Tu La Loi Noi Doi Cua Em',
    artist: 'Ha Anh Tuan',
    artwork: require('./assets/Thang-Tu-La-Loi-Noi-Doi-Cua-Em-Ha-Anh-Tuan.jpg'),
  },
];

function App(): JSX.Element {
  const Home = () => {
    return (
      <BottomTab.Navigator
        tabBar={props => {
          return (
            <>
              {/* Đây là Mini Player */}
              <MiniPlayer />
              {/* đặt ngay trên BottomTab */}
              <BottomTabBar {...props} />
            </>
          );
        }}
        screenOptions={{
          tabBarActiveTintColor: '#f43a5a',
          headerShown: false,
          tabBarButton: ({children, style, ...props}) => (
            <TouchableNativeFeedback
              hitSlop={{top: 0, bottom: 10, left: 10, right: 10}}
              background={TouchableNativeFeedback.Ripple('#00000011', false, 50)}
              {...props}
              useForeground>
              <View style={[style, {backgroundColor: '#ffffffcc'}]}>{children}</View>
            </TouchableNativeFeedback>
          ),
        }}>
        <BottomTab.Screen
          name="Hello"
          component={Hello}
          options={{
            title: 'Hello',
            tabBarIcon: ({focused, color, size}) => (
              <FontAwesomeIcon name="sun-o" size={size} color={color} />
            ),
          }}
        />
        <BottomTab.Screen
          name="Search"
          component={Search}
          options={{
            title: 'Search',
            tabBarIcon: ({focused, color, size}) => (
              <FontAwesomeIcon name="search" size={size} color={color} />
            ),
          }}
        />
        <BottomTab.Screen
          name="Welcome"
          component={NewApp}
          options={{
            title: 'Welcome',
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
      <PlayerProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Home" component={Home} options={{headerShown: false}} />
            {/* <Stack.Screen
            name="PlaylistDetail"
            component={PlaylistDetail}
            options={{
              headerShown: false,
              // ...TransitionPresets.ModalPresentationIOS, // TransitionPresets.ModalSlideFromBottomIOS
              ...TransitionPresets.ModalSlideFromBottomIOS,
            }}
          /> */}
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
      </PlayerProvider>
    </SafeAreaProvider>
  );
}

export default App;
