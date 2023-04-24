import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps, useFocusEffect} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StackScreenProps} from '@react-navigation/stack';
import React from 'react';
import {BottomTabParamList, RootStackParamList} from '../../../App';
import MainPage from './MainPage';
import PlaylistPage from './PlaylistPage';
import {StatusBar} from 'react-native';
import {MyPlaylist} from '../../types';
import {Profile} from '../Profile';

type Props = CompositeScreenProps<
  BottomTabScreenProps<BottomTabParamList, 'MyPlaylists'>,
  StackScreenProps<RootStackParamList>
>;

export type MyPlaylistsStackParamList = {
  MainPage: undefined;
  PlaylistPage: {playlist: MyPlaylist};
  Profile: undefined;
};

const MyPlaylistsStack = createNativeStackNavigator<MyPlaylistsStackParamList>();

const MyPlaylists: React.FC<Props> = ({navigation}) => {
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
    }, []),
  );

  return (
    <MyPlaylistsStack.Navigator screenOptions={{headerShown: false, animation: 'fade'}}>
      <MyPlaylistsStack.Screen name="MainPage" component={MainPage} />
      <MyPlaylistsStack.Screen name="PlaylistPage" component={PlaylistPage} />
      <MyPlaylistsStack.Screen name="Profile" component={Profile} />
    </MyPlaylistsStack.Navigator>
  );
};

export default MyPlaylists;
