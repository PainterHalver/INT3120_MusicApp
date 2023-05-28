import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps, useFocusEffect} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StackScreenProps} from '@react-navigation/stack';
import React from 'react';
import {StatusBar} from 'react-native';
import {BottomTabParamList, RootStackParamList} from '../../../App';
import DiscoverPage from './DiscoverPage';
import PlaylistDetail from './PlaylistDetail';

type Props = CompositeScreenProps<
  BottomTabScreenProps<BottomTabParamList, 'Discover'>,
  StackScreenProps<RootStackParamList>
>;

export type DiscoverStackParamList = {
  DiscoverPage: undefined;
  PlaylistDetail: undefined;
};

const DiscoverStack = createNativeStackNavigator<DiscoverStackParamList>();

const DiscoverScreen: React.FC<Props> = ({navigation}) => {
  return (
    <DiscoverStack.Navigator screenOptions={{headerShown: false, animation: 'fade'}}>
      <DiscoverStack.Screen name="DiscoverPage" component={DiscoverPage} />
      <DiscoverStack.Screen name="PlaylistDetail" component={PlaylistDetail} />
    </DiscoverStack.Navigator>
  );
};

export default DiscoverScreen;
