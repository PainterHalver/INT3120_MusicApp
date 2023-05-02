/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {BottomTabBar, createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer, NavigatorScreenParams} from '@react-navigation/native';
import {TransitionPresets, createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {Text, TouchableNativeFeedback, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import MiniPlayer from './src/components/MiniPlayer';
import {COLORS} from './src/constants';
import {AuthProvider} from './src/contexts/AuthContext';
import {BottomSheetProvider} from './src/contexts/BottomSheetContext';
import {LoadingModalProvider} from './src/contexts/LoadingModalContext';
import {PlayerProvider} from './src/contexts/PlayerContext';
import {PlaylistProvider} from './src/contexts/PlaylistContext';
import {SpinningDiscProvider} from './src/contexts/SpinningDiscContext';
import {ChartIcon} from './src/icons/ChartIcon';
import {DoubleCircleIcon} from './src/icons/DoubleCircleIcon';
import {DownloadIcon} from './src/icons/DownloadIcon';
import {SearchIcon} from './src/icons/SearchIcon';
import ChartDetail from './src/screens/ChartDetail';
import Downloaded from './src/screens/Downloaded';
import MyPlaylists, {MyPlaylistsStackParamList} from './src/screens/MyPlaylists';
import DiscoverPage from './src/screens/NewApp/DiscoverPage';
import Player from './src/screens/Player';
import PlaylistDetail from './src/screens/NewApp/PlaylistDetail';
import Search from './src/screens/Search';
import Test from './src/screens/Test';
import DiscoverScreen, {DiscoverStackParamList} from './src/screens/NewApp';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();
// const Stack = createNativeStackNavigator<RootStackParamList>();

// https://reactnavigation.org/docs/typescript/#type-checking-screens
export type BottomTabParamList = {
  Test: undefined;
  Search: {
    shouldFocusSearchBar?: boolean;
  };
  Discover: NavigatorScreenParams<DiscoverStackParamList>;
  Downloaded: undefined;
  ChartDetail: undefined;
  MyPlaylists: NavigatorScreenParams<MyPlaylistsStackParamList>;
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
          name="Discover"
          component={DiscoverScreen}
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
          name="ChartDetail"
          component={ChartDetail}
          options={{
            title: 'Chart',
            tabBarIcon: ({focused, color, size}) => <ChartIcon size={size + 8} color={color} />,
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
              <FontAwesomeIcon name="user" size={size - 4} color={color} />
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
          <PlaylistProvider>
            <LoadingModalProvider>
              <GestureHandlerRootView style={{flex: 1}}>
                <BottomSheetModalProvider>
                  <BottomSheetProvider>
                    <SpinningDiscProvider>
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
                    </SpinningDiscProvider>
                  </BottomSheetProvider>
                </BottomSheetModalProvider>
              </GestureHandlerRootView>
            </LoadingModalProvider>
          </PlaylistProvider>
        </PlayerProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

export default App;
