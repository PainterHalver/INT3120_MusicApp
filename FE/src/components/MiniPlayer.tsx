import {NavigationProp, useNavigation} from '@react-navigation/native';
import React, {useCallback, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import TrackPlayer, {State, usePlaybackState} from 'react-native-track-player';
import IonIcon from 'react-native-vector-icons/Ionicons';

import {RootStackParamList} from '../../App';
import {COLORS} from '../constants';
import {usePlayer} from '../contexts/PlayerContext';
import {HeartIcon} from '../icons/HeartIcon';
import SpinningDisc from './SpinningDisc';
import {PhoneIcon} from '../icons/PhoneIcon';

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

  const lastSkipToNext = useRef(0);
  const skipToNext = useCallback(async () => {
    const now = Date.now();
    if (now - lastSkipToNext.current > 1000) {
      await TrackPlayer.skipToNext();
      lastSkipToNext.current = now;
    }
  }, []);

  // TODO: Implement this
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <View>
      <View style={{backgroundColor: '#22222233', height: 2}}>
        <View
          style={{
            backgroundColor: COLORS.RED_PRIMARY,
            height: '100%',
            width: `${progress.duration !== 0 ? (progress.position / progress.duration) * 100 : 0}%`,
          }}
        />
      </View>
      <TouchableNativeFeedback
        background={TouchableNativeFeedback.Ripple('#00000011', false)}
        onPress={() => {
          navigation.navigate('Player');
        }}>
        <View style={styles.container}>
          <SpinningDisc size={40} />
          <View style={styles.metadata}>
            <Text style={{fontSize: 13, color: '#000'}}>
              {currentTrack.title && currentTrack.title.length > 30
                ? currentTrack.title.substring(0, 30) + '...'
                : currentTrack.title}
            </Text>
            <Text style={{fontSize: 13}}>
              {currentTrack.artist && currentTrack.artist.length > 30
                ? currentTrack.artist.substring(0, 30) + '...'
                : currentTrack.artist}
            </Text>
          </View>
          <View style={styles.controls}>
            <TouchableNativeFeedback
              hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
              background={TouchableNativeFeedback.Ripple(RIPPLE_COLOR, true, 35)}
              onPress={() => {
                if (currentTrack.url.toString().startsWith('http')) {
                  toggleFavorite();
                } else {
                  ToastAndroid.show('Nhạc Offline', ToastAndroid.SHORT);
                }
              }}>
              <View>
                {!currentTrack || !currentTrack.url ? (
                  <ActivityIndicator size={26} color={COLORS.RED_PRIMARY} />
                ) : currentTrack.url.toString().startsWith('http') ? (
                  isFavorite ? (
                    <HeartIcon size={25} color={COLORS.RED_PRIMARY} fill={COLORS.RED_PRIMARY} />
                  ) : (
                    <HeartIcon size={25} color={COLORS.TEXT_PRIMARY} />
                  )
                ) : (
                  <PhoneIcon size={25} color={COLORS.TEXT_PRIMARY} />
                )}
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

const RIPPLE_COLOR = '#ccc';

export default MiniPlayer;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 55,
    backgroundColor: COLORS.BOTTOM_BAR,
    paddingHorizontal: 15,
    alignItems: 'center',
    gap: 10,
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
