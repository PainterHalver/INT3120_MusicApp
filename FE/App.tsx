/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {BottomTabBar, createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {DefaultTheme, NavigationContainer, NavigatorScreenParams} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import React, {useEffect} from 'react';
import {Text, TouchableNativeFeedback, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
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
import {DatabaseProvider} from './src/contexts/DatabaseContext';
import {DoubleCircleIcon} from './src/icons/DoubleCircleIcon';
import {SearchIcon} from './src/icons/SearchIcon';
import {COLORS} from './src/constants';
import BottomSheet, {BottomSheetBackdrop, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {LoadingModalProvider} from './src/contexts/LoadingModalContext';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

// https://reactnavigation.org/docs/typescript/#type-checking-screens
export type BottomTabParamList = {
  Hello: undefined;
  Search: {
    shouldFocusSearchBar?: boolean;
  };
  Welcome: undefined;
};

export type RootStackParamList = {
  Home: NavigatorScreenParams<BottomTabParamList>;
  Player: undefined;
  PlaylistDetail: undefined;
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
          tabBarActiveTintColor: '#f43a5a',
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
          name="Hello"
          component={Hello}
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
      <PlayerProvider>
        <DatabaseProvider>
          <LoadingModalProvider>
            <GestureHandlerRootView style={{flex: 1}}>
              <BottomSheetModalProvider>
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
                        // gestureEnabled: true,
                        // gestureResponseDistance: 100,
                        // ...TransitionPresets.ModalPresentationIOS, // TransitionPresets.ModalSlideFromBottomIOS
                        ...TransitionPresets.ModalSlideFromBottomIOS,
                      }}
                    />
                  </Stack.Navigator>
                </NavigationContainer>
                {/* <BottomSheet
            enablePanDownToClose
            ref={bottomSheetRef}
            index={1}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            backgroundStyle={{backgroundColor: 'cyan'}}
            backdropComponent={props => (
              <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
            )}>
            <View>
              <Text>Awesome 🎉</Text>
            </View>
          </BottomSheet> */}
              </BottomSheetModalProvider>
            </GestureHandlerRootView>
          </LoadingModalProvider>
        </DatabaseProvider>
      </PlayerProvider>
    </SafeAreaProvider>
  );
}

export default App;
