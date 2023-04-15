/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {BottomTabBar, createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer, NavigatorScreenParams} from '@react-navigation/native';
import {TransitionPresets, createStackNavigator} from '@react-navigation/stack';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {Text, TouchableNativeFeedback, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import {SafeAreaProvider} from 'react-native-safe-area-context';
import Test from './src/screens/Test';
import NewApp from './src/screens/NewApp';
import Player from './src/screens/Player';
import PlaylistDetail from './src/screens/PlaylistDetail';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import MiniPlayer from './src/components/MiniPlayer';
import {COLORS} from './src/constants';
import {LoadingModalProvider} from './src/contexts/LoadingModalContext';
import {PlayerProvider} from './src/contexts/PlayerContext';
import {DoubleCircleIcon} from './src/icons/DoubleCircleIcon';
import {DownloadIcon} from './src/icons/DownloadIcon';
import {SearchIcon} from './src/icons/SearchIcon';
import Downloaded from './src/screens/Downloaded';
import Search from './src/screens/Search';
import ChartDetail from './src/screens/ChartDetail';
import {SongBottomSheetModalProvider} from './src/contexts/SongBottomSheetModalContext';
import {AuthProvider} from './src/contexts/AuthContext';
import MyPlaylists from './src/screens/MyPlaylists';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();
// const Stack = createNativeStackNavigator<RootStackParamList>();

// https://reactnavigation.org/docs/typescript/#type-checking-screens
export type BottomTabParamList = {
  Test: undefined;
  Search: {
    shouldFocusSearchBar?: boolean;
  };
  Welcome: undefined;
  Downloaded: undefined;
  PlaylistDetail: undefined;
  ChartDetail: undefined;
  MyPlaylists: undefined;
};

export type RootStackParamList = {
  Home: NavigatorScreenParams<BottomTabParamList>;
  Player: undefined;
};

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
          tabBarActiveTintColor: COLORS.RED_PRIMARY,
          headerShown: false,
          tabBarStyle: {
            backgroundColor: COLORS.BOTTOM_BAR,
            borderTopWidth: 0.5,
            shadowOffset: {width: 0, height: 0},
            elevation: 0,
          },
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
          name="Welcome"
          component={NewApp}
          options={{
            title: 'Khám phá',
            tabBarIcon: ({focused, color, size}) => <DoubleCircleIcon size={size - 5} color={color} />,
          }}
        />
        <BottomTab.Screen
          name="Search"
          component={Search}
          options={{
            title: 'Tìm kiếm',
            tabBarIcon: ({focused, color, size}) => <SearchIcon size={size - 5} color={color} />,
          }}
        />
        <BottomTab.Screen
          name="PlaylistDetail"
          component={PlaylistDetail}
          options={{
            title: 'Playlist',
            tabBarIcon: ({focused, color, size}) => (
              <DownloadIcon size={size} color={color} strokeWidth={15} />
            ),
          }}
        />
        <BottomTab.Screen
          name="ChartDetail"
          component={ChartDetail}
          options={{
            title: 'Chart',
            tabBarIcon: ({focused, color, size}) => (
              <DownloadIcon size={size} color={color} strokeWidth={15} />
            ),
          }}
        />
        <BottomTab.Screen
          name="Downloaded"
          component={Downloaded}
          options={{
            title: 'Đã tải',
            tabBarIcon: ({focused, color, size}) => (
              <DownloadIcon size={size} color={color} strokeWidth={15} />
            ),
          }}
        />
        <BottomTab.Screen
          name="MyPlaylists"
          component={MyPlaylists}
          options={{
            title: 'Playlists',
            tabBarIcon: ({focused, color, size}) => (
              <FontAwesomeIcon name="sun-o" size={size} color={color} />
            ),
          }}
        />
        <BottomTab.Screen
          name="Test"
          component={Test}
          options={{
            title: 'Hello',
            tabBarIcon: ({focused, color, size}) => (
              <FontAwesomeIcon name="sun-o" size={size} color={color} />
            ),
          }}
        />
      </BottomTab.Navigator>
    );
  };

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <PlayerProvider>
          <LoadingModalProvider>
            <GestureHandlerRootView style={{flex: 1}}>
              <BottomSheetModalProvider>
                <SongBottomSheetModalProvider>
                  <NavigationContainer
                    theme={{
                      dark: false,
                      colors: {
                        primary: 'rgb(0, 122, 255)',
                        background: COLORS.BACKGROUND_PRIMARY,
                        card: 'rgb(255, 255, 255)',
                        text: COLORS.TEXT_PRIMARY,
                        border: 'rgb(216, 216, 216)',
                        notification: 'rgb(255, 59, 48)',
                      },
                    }}>
                    <Stack.Navigator>
                      <Stack.Screen name="Home" component={Home} options={{headerShown: false}} />
                      <Stack.Screen
                        name="Player"
                        component={Player}
                        options={{
                          headerShown: false,
                          // gestureEnabled: true,
                          // gestureResponseDistance: 100,
                          // ...TransitionPresets.ModalPresentationIOS, // TransitionPresets.ModalSlideFromBottomIOS
                          ...TransitionPresets.ModalSlideFromBottomIOS,
                          // animation: 'slide_from_bottom'
                        }}
                      />
                    </Stack.Navigator>
                  </NavigationContainer>
                </SongBottomSheetModalProvider>
              </BottomSheetModalProvider>
            </GestureHandlerRootView>
          </LoadingModalProvider>
        </PlayerProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

export default App;
