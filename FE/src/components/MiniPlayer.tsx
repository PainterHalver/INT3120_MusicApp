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
import {usePlayer} from '../contexts/PlayerContext';

const MiniPlayer = () => {
  const playbackState = usePlaybackState();
  const isPlaying = playbackState.state === State.Playing;
  const {currentTrack, progress} = usePlayer();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const togglePlayback = async () => {
    const state = playbackState.state;
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
    <View>
      <View style={{backgroundColor: '#22222233', height: 2}}>
        <View
          style={{
            backgroundColor: PRIMARY_COLOR,
            height: '100%',
            width: `${(progress.position / progress.duration) * 100}%`,
          }}
        />
      </View>
      <TouchableNativeFeedback
        background={TouchableNativeFeedback.Ripple('#00000011', false)}
        onPress={() => {
          navigation.navigate('Player');
        }}>
        <View style={styles.container}>
          <Animated.Image
            source={
              currentTrack.artwork
                ? currentTrack.artwork
                : require('./../../assets/Led_Zeppelin-Stairway_To_Heaven.png')
            }
            style={[
              styles.image,
              // {transform: [{rotate: spin}, {perspective: 1000}]}
            ]}
          />
          <View style={styles.metadata}>
            <Text style={{fontSize: 13, color: '#000'}}>
              {currentTrack.title && currentTrack.title.length > 30
                ? currentTrack.title.substring(0, 30) + '...'
                : currentTrack.title}
            </Text>
            <Text style={{fontSize: 13}}>
              {' '}
              {currentTrack.artist && currentTrack.artist.length > 30
                ? currentTrack.artist.substring(0, 30) + '...'
                : currentTrack.artist}
            </Text>
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
                  color={isFavorite ? PRIMARY_COLOR : '#000'}
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
    </View>
  );
};

const PRIMARY_COLOR = '#f43a5a';
const RIPPLE_COLOR = '#ccc';

export default MiniPlayer;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 55,
    backgroundColor: 'rgb(245,245,245)',
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
