import React, {memo} from 'react';
import {View, StatusBar} from 'react-native';
import {useState, useEffect} from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import {CompositeScreenProps, useFocusEffect} from '@react-navigation/native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {BottomTabParamList, RootStackParamList} from '../../../../App';
import {ZingMp3} from '../../../ZingMp3';
import {Playlist} from '../../../types';
import PlaylistView from './PlaylistView';
import {usePlaylist} from '../../../contexts/PlaylistContext';
import {DiscoverStackParamList} from '..';

type Props = CompositeScreenProps<
  CompositeScreenProps<
    StackScreenProps<DiscoverStackParamList, 'PlaylistDetail'>,
    BottomTabScreenProps<BottomTabParamList, 'Discover'>
  >,
  StackScreenProps<RootStackParamList>
>;

const PlaylistDetail = ({navigation}: Props) => {
  const {playlist} = usePlaylist();
  const [recommends, setRecommends] = useState();

  if (!playlist) {
    return <View />;
  }

  return <PlaylistView playlist={playlist} />;
};

export default memo(PlaylistDetail);
