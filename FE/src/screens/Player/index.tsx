// Bắt remount lại component chứ không fast refresh
// @refresh reset

import AsyncStorage from '@react-native-async-storage/async-storage';

import {StackScreenProps} from '@react-navigation/stack';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from 'react-native';
import TrackPlayer, {RepeatMode, State, usePlaybackState} from 'react-native-track-player';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import {BottomSheetModal} from '@gorhom/bottom-sheet';
import AnimatedLottieView from 'lottie-react-native';
import Reanimated, {
  Extrapolate,
  FadeIn,
  FadeOut,
  Layout,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {RootStackParamList} from '../../../App';
import {COLORS} from '../../constants';
import {usePlayer} from '../../contexts/PlayerContext';
import {RepeatIcon} from '../../icons/RepeatIcon';
import {RepeatOnceIcon} from '../../icons/RepeatOnceIcon';
import {ShuffleIcon} from '../../icons/ShuffleIcon';
import {PlayPauseLottieIcon} from './PlayPauseLottieIcon';
import PlayerBackground from './PlayerBackground';
import PlayerScrollView from './PlayerScrollView';
import PlayingSongBottomSheet from './PlayingSongBottomSheet';
import {SliderAndProgress} from './SliderAndProgress';

const {height, width: screenWidth} = Dimensions.get('screen');
type Props = StackScreenProps<RootStackParamList, 'Player'>;

const Player = ({navigation}: Props) => {
  const playbackState = usePlaybackState();
  const isPlaying = playbackState.state === State.Playing;
  const {currentTrack} = usePlayer();
  const [repeatMode, setRepeatMode] = useState<RepeatMode>(RepeatMode.Off);
  const [isShuffleEnabled, setIsShuffleEnabled] = useState(false);
  const playingSongBottonSheetRef = React.useRef<BottomSheetModal>(null);
  const playButtonRef = useRef<AnimatedLottieView>(null);
  const [currentPage, setCurrentPage] = useState<number>(-1); // 0 -1 -2

  // Paging animation
  const translateX = useSharedValue(-screenWidth);

  useEffect(() => {
    // Set thông tin playback từ AsyncStorage
    (async () => {
      const isShuffleEnabled = await AsyncStorage.getItem('@shuffle_enabled');
      setIsShuffleEnabled(isShuffleEnabled === 'true');
      const repeatMode = await AsyncStorage.getItem('@repeat_mode');
      if (repeatMode) {
        setRepeatMode(parseInt(repeatMode));
        await TrackPlayer.setRepeatMode(parseInt(repeatMode));
      }
    })();
  }, []);

  const play = async () => {
    await TrackPlayer.play();
  };

  const pause = async () => {
    await TrackPlayer.pause();
  };

  const togglePlayback = async () => {
    const state = (await TrackPlayer.getPlaybackState()).state;
    const currentTrack = await TrackPlayer.getActiveTrackIndex();
    if (currentTrack !== null) {
      if (state === State.Playing) {
        pause();
      } else {
        play();
      }
    }
  };

  const lastSkipToPrevious = useRef(0);
  const skipToPrevious = useCallback(async () => {
    const now = Date.now();
    if (now - lastSkipToPrevious.current > 1000) {
      await TrackPlayer.skipToPrevious();
      lastSkipToPrevious.current = now;
    }
  }, []);

  const lastSkipToNext = useRef(0);
  const skipToNext = useCallback(async () => {
    const now = Date.now();
    if (now - lastSkipToNext.current > 1000) {
      await TrackPlayer.skipToNext();
      lastSkipToNext.current = now;
    }
  }, []);

  const toggleRepeateMode = async () => {
    const modes = [RepeatMode.Off, RepeatMode.Queue, RepeatMode.Track];
    const index = modes.indexOf(repeatMode);
    const nextMode = modes[(index + 1) % modes.length];
    TrackPlayer.setRepeatMode(nextMode);
    setRepeatMode(nextMode);
    await AsyncStorage.setItem('@repeat_mode', nextMode.toString());
  };

  // TODO: Shuffle or Random
  const toggleShuffleMode = async () => {
    ToastAndroid.show('Shuffle chưa code!!!', ToastAndroid.SHORT);
    setIsShuffleEnabled(!isShuffleEnabled);
    await AsyncStorage.setItem('@shuffle_enabled', (!isShuffleEnabled).toString());
  };

  const rProgress = useAnimatedStyle(() => {
    const offsetY = interpolate(
      translateX.value,
      [-2 * screenWidth, -screenWidth, 0],
      [0, -100, 0],
      Extrapolate.CLAMP,
    );

    return {
      transform: [{translateY: offsetY}],
    };
  });
  const rControl = useAnimatedStyle(() => {
    const offsetY = interpolate(
      translateX.value,
      [-2 * screenWidth, -screenWidth, 0],
      [0, -70, 0],
      Extrapolate.CLAMP,
    );

    return {
      transform: [{translateY: offsetY}],
    };
  });

  return (
    <View style={styles.containerWrapper}>
      <StatusBar
        barStyle={'light-content'}
        translucent
        backgroundColor={'transparent'}
        animated={true}
      />
      <PlayerBackground>
        <View style={styles.container}>
          <View style={[styles.heading]}>
            <TouchableOpacity
              hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
              onPress={() => {
                navigation.goBack();
              }}>
              <AntDesignIcon name="down" size={23} color="#fff" />
            </TouchableOpacity>
            <View style={{alignItems: 'center'}}>
              {currentPage > -2 && (
                <Reanimated.Text style={{color: '#ffffffaa', fontSize: 12}}>PHÁT TỪ</Reanimated.Text>
              )}
              {currentPage > -2 && (
                <Reanimated.Text style={{color: '#fff', fontSize: 13}}>...</Reanimated.Text>
              )}
              {currentPage < -1 && (
                <Reanimated.Text style={{color: '#ffffff', fontSize: 15, fontWeight: '500'}}>
                  Lời bài hát
                </Reanimated.Text>
              )}
            </View>
            <TouchableNativeFeedback
              hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
              background={TouchableNativeFeedback.Ripple(COLORS.RIPPLE, true, 23)}
              onPress={() => {
                playingSongBottonSheetRef.current?.present();
              }}>
              <View>
                <IonIcon name="ios-ellipsis-vertical" size={23} color="#fff" />
              </View>
            </TouchableNativeFeedback>
          </View>

          {/* Scroll View Container */}
          <View style={{flex: 10}}>
            {/* Paginator */}
            <View
              style={{
                padding: 2,
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 3,
              }}>
              {[0, 1, 2].map((_, i) => {
                const inputRange = [(-i - 1) * screenWidth, -i * screenWidth, (-i + 1) * screenWidth];

                const rWidth = useAnimatedStyle(() => {
                  const dotWidth = interpolate(
                    translateX.value,
                    inputRange,
                    [5, 12, 5],
                    Extrapolate.CLAMP,
                  );
                  const opacity = interpolate(
                    translateX.value,
                    inputRange,
                    [0.4, 1, 0.4],
                    Extrapolate.CLAMP,
                  );

                  return {
                    width: dotWidth,
                    opacity,
                  };
                });

                return (
                  <Reanimated.View
                    key={i}
                    style={[
                      {
                        height: 2.5,
                        borderRadius: 5,
                        backgroundColor: '#fff',
                      },
                      rWidth,
                    ]}
                  />
                );
              })}
            </View>
            {/* ScrollView */}
            <PlayerScrollView translateX={translateX} setCurrentPage={setCurrentPage} />
          </View>

          {/* SLIDER */}
          <Reanimated.View style={[styles.progressContainer, rProgress]}>
            <SliderAndProgress />
          </Reanimated.View>

          <Reanimated.View style={[styles.controlContainer, rControl]}>
            <TouchableNativeFeedback
              hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
              background={TouchableNativeFeedback.Ripple(COLORS.RIPPLE, true, CONTROL_RIPPLE_RADIUS)}
              onPress={toggleShuffleMode}>
              <View>
                <ShuffleIcon size={25} color={isShuffleEnabled ? ICON_ACTIVATED_COLOR : '#ffffffaa'} />
              </View>
            </TouchableNativeFeedback>
            <View style={styles.playbackControl}>
              <TouchableNativeFeedback
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                background={TouchableNativeFeedback.Ripple(COLORS.RIPPLE, true, CONTROL_RIPPLE_RADIUS)}
                onPress={skipToPrevious}>
                <View>
                  <MaterialIcon name="skip-previous" size={55} color="#fff" />
                </View>
              </TouchableNativeFeedback>
              {/* <TouchableNativeFeedback
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                background={TouchableNativeFeedback.Ripple(COLORS.RIPPLE, true, CONTROL_RIPPLE_RADIUS)}
                onPress={() => {
                  togglePlayback();
                }}>
                <View>
                  <AntDesignIcon
                    name={isPlaying ? 'pausecircleo' : 'playcircleo'}
                    size={60}
                    color="#fff"
                  />
                </View>
              </TouchableNativeFeedback> */}
              <PlayPauseLottieIcon />
              <TouchableNativeFeedback
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                background={TouchableNativeFeedback.Ripple(COLORS.RIPPLE, true, CONTROL_RIPPLE_RADIUS)}
                onPress={skipToNext}>
                <View>
                  <MaterialIcon name="skip-next" size={55} color="#fff" />
                </View>
              </TouchableNativeFeedback>
            </View>
            <TouchableNativeFeedback
              hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
              background={TouchableNativeFeedback.Ripple(COLORS.RIPPLE, true, CONTROL_RIPPLE_RADIUS)}
              onPress={toggleRepeateMode}>
              <View>
                {repeatMode == RepeatMode.Track ? (
                  <RepeatOnceIcon
                    size={25}
                    color={repeatMode === RepeatMode.Off ? '#ffffffaa' : ICON_ACTIVATED_COLOR}
                  />
                ) : (
                  <RepeatIcon
                    size={25}
                    color={repeatMode === RepeatMode.Off ? '#ffffffaa' : ICON_ACTIVATED_COLOR}
                  />
                )}
              </View>
            </TouchableNativeFeedback>
          </Reanimated.View>
        </View>
      </PlayerBackground>
      <PlayingSongBottomSheet ref={playingSongBottonSheetRef} />
    </View>
  );
};

const NORMAL_ICON_SIZE = 28;
const CONTROL_RIPPLE_RADIUS = 45;
const ICON_ACTIVATED_COLOR = '#f43a5a';

export default Player;

const styles = StyleSheet.create({
  containerWrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  heading: {
    height: 52,
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  progressContainer: {
    flex: 1,
    // backgroundColor: '#712722',
    paddingHorizontal: 25,
  },
  controlContainer: {
    // flex: 1,
    // backgroundColor: '#151a6c',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingBottom: 5,
  },
  playbackControl: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 15,
  },
});
