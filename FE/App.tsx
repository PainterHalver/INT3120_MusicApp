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
import {Text, TouchableNativeFeedback, View} from 'react-native';
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
import {DoubleCircleIcon} from './src/icons/DoubleCircleIcon';

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
  // {
  //   id: 1,
  //   url: require('./assets/Led_Zeppelin-Stairway_To_Heaven.mp3'),
  //   title: 'Stairway To Heaven',
  //   artist: 'Led Zeppelin',
  //   artwork: require('./assets/Led_Zeppelin-Stairway_To_Heaven.png'),
  // },
  // {
  //   id: 2,
  //   url: require('./assets/Gnarls-Barkley-Crazy.mp3'),
  //   title: 'Crazy',
  //   artist: 'Gnarls Barkley',
  //   artwork: require('./assets/Gnarls-Barkley-Crazy.jpg'),
  // },
  // {
  //   id: 3,
  //   url: require('./assets/Thang-Tu-La-Loi-Noi-Doi-Cua-Em-Ha-Anh-Tuan.mp3'),
  //   title: 'Thang Tu La Loi Noi Doi Cua Em',
  //   artist: 'Ha Anh Tuan',
  //   artwork: require('./assets/Thang-Tu-La-Loi-Noi-Doi-Cua-Em-Ha-Anh-Tuan.jpg'),
  // },
  {
    id: 4,
    url: 'https://mp3-s1-zmp3.zmdcdn.me/0fb7961a885a6104384b/3744477689111912134?authen=exp=1679728791~acl=/0fb7961a885a6104384b/*~hmac=95837cb86af9d8415288d1b2cfcce4f5&fs=MTY3OTU1NTk5MTQxNXx3ZWJWNnwxMDAxMzAzNzIyfDE0LjIzMi4yMDgdUngMTM3',
    title: "STAR WALKIN' (League of Legends Worlds Anthem)",
    artist: 'Lil Nas X',
    artwork:
      'https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/cover/4/0/3/5/40354058076ab81f7da2e14e8965a3e2.jpg',
  },
  {
    id: 5,
    url: 'https://mp3-s1-zmp3.zmdcdn.me/c24b010aaf4d46131f5c/6268129782441873357?authen=exp=1679728854~acl=/c24b010aaf4d46131f5c/*~hmac=924be74438c437c42c26b135bfd46222&fs=MTY3OTU1NjA1NDQ2OHx3ZWJWNnwwfDE3MS4yNTIdUngMTUzLjI0OQ',
    title: 'Prisoner',
    artist: 'Miley Cyrus, Dua Lipa',
    artwork:
      'https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/cover/8/a/7/f/8a7f095c07e570036d93d5f765c03e94.jpg',
  },
  {
    id: 6,
    url: 'https://mp3-s1-zmp3.zmdcdn.me/e67081ab1debf4b5adfa/6844236296318957939?authen=exp=1679728884~acl=/e67081ab1debf4b5adfa/*~hmac=d1f034477c865bfdea68b2932b23d21a&fs=MTY3OTU1NjA4NDExNnx3ZWJWNnwxMDAwMjmUsICxOTmUsIC1fDE0LjE5MS4yNDEdUngMjE2',
    title: 'Crying On The Dancefloor',
    artist: 'Sam Feldt, Jonas Blue, Endless Summer, Violet Days',
    artwork:
      'https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/cover/c/9/4/5/c9459f01d5e8edc9bf8710fab810072e.jpg',
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
          tabBarStyle: {backgroundColor: 'rgb(245,245,245)'},
          tabBarButton: ({children, style, ...props}) => (
            <TouchableNativeFeedback
              hitSlop={{top: 0, bottom: 10, left: 10, right: 10}}
              background={TouchableNativeFeedback.Ripple('#00000011', false, 50)}
              {...props}
              useForeground>
              <View style={[style]}>{children}</View>
            </TouchableNativeFeedback>
          ),
          tabBarLabel: ({focused, color, children}) => (
            <Text
              style={{
                color: color,
                fontSize: 10,
                marginBottom: 5,
                marginTop: -5,
                fontWeight: `${focused ? 'bold' : 'normal'}`,
              }}>
              {children}
            </Text>
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
            title: 'Khám phá',
            tabBarIcon: ({focused, color, size}) => <DoubleCircleIcon size={size - 5} color={color} />,
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
                gestureEnabled: true,
                gestureResponseDistance: 100,
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
