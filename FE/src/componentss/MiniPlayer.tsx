import {Text, View, Button, StyleSheet, TouchableNativeFeedback, Animated} from 'react-native';
import React, {useState} from 'react';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import TrackPlayer, {
  Event,
  State,
  usePlaybackState,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import IonIcon from 'react-native-vector-icons/Ionicons';

import {RootStackParamList} from '../../App';

const MiniPlayer = () => {
  const playbackState = usePlaybackState();
  const isPlaying = playbackState.state === State.Playing;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [trackArtwork, setTrackArtwork] = useState<string | number>('');
  const [trackTitle, setTrackTitle] = useState<string>('');
  const [trackArtist, setTrackArtist] = useState<string>('');
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  // Chỉnh metadata state khi track thay đổi
  useTrackPlayerEvents([Event.PlaybackActiveTrackChanged], async event => {
    if (event.type === Event.PlaybackActiveTrackChanged && event.index !== undefined) {
      const track = await TrackPlayer.getTrack(event.index);
      if (track) {
        setTrackArtwork(track.artwork || '');
        setTrackTitle(track.title || '');
        setTrackArtist(track.artist || '');
      }
    }
  });

  const togglePlayback = async () => {
    const state = playbackState.state;
    const currentTrack = await TrackPlayer.getActiveTrackIndex();
    if (currentTrack !== null) {
      if (state === State.Playing) {
        await TrackPlayer.pause();
      } else {
        await TrackPlayer.play();
      }
    }
  };

  const skipToNext = async () => {
    await TrackPlayer.skipToNext();
  };

  // TODO: Implement this
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <TouchableNativeFeedback
      background={TouchableNativeFeedback.Ripple('#00000011', false)}
      onPress={() => {
        navigation.navigate('Player');
      }}>
      <View style={styles.container}>
        <Animated.Image
          source={
            trackArtwork ? trackArtwork : require('./../../assets/Led_Zeppelin-Stairway_To_Heaven.png')
          }
          style={[
            styles.image,
            // {transform: [{rotate: spin}, {perspective: 1000}]}
          ]}
        />
        <View style={styles.metadata}>
          <Text style={{fontSize: 13, color: '#000'}}>{trackTitle || 'Track Title'}</Text>
          <Text style={{fontSize: 13}}>{trackArtist || 'Track Artist Name'}</Text>
        </View>
        <View style={styles.controls}>
          <TouchableNativeFeedback
            hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
            background={TouchableNativeFeedback.Ripple(RIPPLE_COLOR, true, 35)}
            onPress={toggleFavorite}>
            <View>
              <IonIcon
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={23}
                color={isFavorite ? '#f43a5a' : '#000'}
              />
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback
            hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
            background={TouchableNativeFeedback.Ripple(RIPPLE_COLOR, true, 35)}
            onPress={togglePlayback}>
            <View>
              <IonIcon name={isPlaying ? 'pause' : 'play'} size={27} color={'#000'} />
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback
            hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
            background={TouchableNativeFeedback.Ripple(RIPPLE_COLOR, true, 35)}
            onPress={skipToNext}>
            <View>
              <IonIcon name="play-skip-forward" size={23} color={'#000'} />
            </View>
          </TouchableNativeFeedback>
        </View>
      </View>
    </TouchableNativeFeedback>
  );
};

const RIPPLE_COLOR = '#ccc';

export default MiniPlayer;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 55,
    backgroundColor: '#ffffffcc',
    paddingHorizontal: 15,
    alignItems: 'center',
    gap: 10,
  },
  image: {
    height: 40,
    width: 40,
    borderRadius: 1000,
  },
  metadata: {
    marginRight: 'auto',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },
});
