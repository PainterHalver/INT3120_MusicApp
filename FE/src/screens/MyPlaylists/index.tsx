import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StackScreenProps} from '@react-navigation/stack';
import React from 'react';
import {BottomTabParamList, RootStackParamList} from '../../../App';
import MainPage from './MainPage';
import PlaylistPage from './PlaylistPage';

type Props = CompositeScreenProps<
  BottomTabScreenProps<BottomTabParamList, 'MyPlaylists'>,
  StackScreenProps<RootStackParamList>
>;

export type MyPlaylistsStackParamList = {
  MainPage: undefined;
  PlaylistPage: undefined;
};

const MyPlaylistsStack = createNativeStackNavigator<MyPlaylistsStackParamList>();

const MyPlaylists: React.FC<Props> = ({navigation}) => {
  return (
    <MyPlaylistsStack.Navigator screenOptions={{headerShown: false}}>
      <MyPlaylistsStack.Screen name="MainPage" component={MainPage} />
      <MyPlaylistsStack.Screen
        name="PlaylistPage"
        component={PlaylistPage}
        options={{animation: 'fade'}}
      />
    </MyPlaylistsStack.Navigator>
  );
};

export default MyPlaylists;
