// Bắt remount lại component chứ không fast refresh
// @refresh reset

import AsyncStorage from '@react-native-async-storage/async-storage';
import Slider from '@react-native-community/slider';
import {StackScreenProps} from '@react-navigation/stack';
import React, {useEffect, useState, useRef} from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  ImageBackground,
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
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import {RootStackParamList} from '../../../App';
import {usePlayer} from '../../contexts/PlayerContext';
import {HeartIcon} from '../../icons/HeartIcon';
import {RepeatIcon} from '../../icons/RepeatIcon';
import {RepeatOnceIcon} from '../../icons/RepeatOnceIcon';
import {ShareIcon} from '../../icons/ShareIcon';
import {ShuffleIcon} from '../../icons/ShuffleIcon';
import SpinningDisc from '../../components/SpinningDisc';
import PlayerBackground from './PlayerBackground';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import PlayingSongBottomSheet from './PlayingSongBottomSheet';
import AnimatedLottieView from 'lottie-react-native';

const {height, width} = Dimensions.get('screen');
type Props = StackScreenProps<RootStackParamList, 'Player'>;

const Player = ({navigation}: Props) => {
  const playbackState = usePlaybackState();
  const isPlaying = playbackState.state === State.Playing;
  const {currentTrack, progress} = usePlayer();
  const [sliderValue, setSliderValue] = useState<number>(0);
  const [slidingSlider, setSlidingSlider] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>(RepeatMode.Off);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [isShuffleEnabled, setIsShuffleEnabled] = useState(false);
  const playingSongBottonSheetRef = React.useRef<BottomSheetModal>(null);
  const playButtonRef = useRef<AnimatedLottieView>(null);

  useEffect(() => {
    if (!slidingSlider) {
      setSliderValue(progress.position);
    }
  }, [progress]);

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

  const skipToPrevious = async () => {
    await TrackPlayer.skipToPrevious();
  };

  const skipToNext = async () => {
    await TrackPlayer.skipToNext();
  };

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

  // TODO: Implement this
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

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
              <Text style={{color: '#ffffffaa', fontSize: 12}}>PHÁT TỪ</Text>
              <Text style={{color: '#fff', fontSize: 13}}>...</Text>
            </View>
            <TouchableNativeFeedback
              hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
              background={TouchableNativeFeedback.Ripple(RIPPLE_COLOR, true, 23)}
              onPress={() => {
                playingSongBottonSheetRef.current?.present();
              }}>
              <View>
                <IonIcon name="ios-ellipsis-vertical" size={23} color="#fff" />
              </View>
            </TouchableNativeFeedback>
          </View>
          <View style={styles.imageContainer}>
            <View style={styles.imageView}>
              <SpinningDisc size={width * 0.77} />
            </View>
          </View>
          <View style={styles.metadataContainer}>
            <TouchableNativeFeedback
              hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
              background={TouchableNativeFeedback.Ripple(RIPPLE_COLOR, true, CONTROL_RIPPLE_RADIUS)}>
              <View>
                <ShareIcon size={21} color="#ffffffaa" />
              </View>
            </TouchableNativeFeedback>
            <View style={styles.metadata}>
              <Text style={{color: '#fff', fontSize: 18, fontWeight: '600'}}>
                {currentTrack.title && currentTrack.title.length > 25
                  ? currentTrack.title.substring(0, 25) + '...'
                  : currentTrack.title}
              </Text>
              <Text style={{color: '#ffffffbb', fontSize: 16}}>
                {currentTrack.artist && currentTrack.artist.length > 30
                  ? currentTrack.artist.substring(0, 30) + '...'
                  : currentTrack.artist}
              </Text>
            </View>
            <TouchableNativeFeedback
              hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
              background={TouchableNativeFeedback.Ripple(RIPPLE_COLOR, true, CONTROL_RIPPLE_RADIUS)}
              onPress={toggleFavorite}>
              <View>
                {isFavorite ? (
                  <HeartIcon size={25} color={ICON_ACTIVATED_COLOR} fill={ICON_ACTIVATED_COLOR} />
                ) : (
                  <HeartIcon size={25} color="#ffffffaa" />
                )}
              </View>
            </TouchableNativeFeedback>
          </View>
          <View style={styles.progressContainer}>
            <View style={{marginHorizontal: -15}}>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={progress.duration}
                value={sliderValue}
                thumbTintColor="#fff"
                minimumTrackTintColor="#fff"
                maximumTrackTintColor="#ffffff"
                onSlidingComplete={async value => {
                  setSlidingSlider(false);
                  await TrackPlayer.seekTo(value + 1); // +1 để để khớp với progress (đừng hỏi tại sao)
                }}
                onValueChange={value => {
                  setSliderValue(value);
                }}
                onSlidingStart={() => setSlidingSlider(true)}
              />
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{color: '#ffffffcc'}}>
                {Math.floor(sliderValue / 60)
                  .toString()
                  .padStart(2, '0') +
                  ':' +
                  Math.floor(sliderValue % 60)
                    .toString()
                    .padStart(2, '0')}
              </Text>
              <Text style={{color: '#ffffffcc'}}>
                {Math.floor((progress.duration - sliderValue + 1) / 60)
                  .toString()
                  .padStart(2, '0') +
                  ':' +
                  Math.floor((progress.duration - sliderValue + 1) % 60)
                    .toString()
                    .padStart(2, '0')}
              </Text>
            </View>
          </View>
          <View style={styles.controlContainer}>
            <TouchableNativeFeedback
              hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
              background={TouchableNativeFeedback.Ripple(RIPPLE_COLOR, true, CONTROL_RIPPLE_RADIUS)}
              onPress={toggleShuffleMode}>
              <View>
                <ShuffleIcon size={25} color={isShuffleEnabled ? ICON_ACTIVATED_COLOR : '#ffffffaa'} />
              </View>
            </TouchableNativeFeedback>
            <View style={styles.playbackControl}>
              <TouchableNativeFeedback
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                background={TouchableNativeFeedback.Ripple(RIPPLE_COLOR, true, CONTROL_RIPPLE_RADIUS)}
                onPress={skipToPrevious}>
                <View>
                  <MaterialIcon name="skip-previous" size={55} color="#fff" />
                </View>
              </TouchableNativeFeedback>
              <TouchableNativeFeedback
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                background={TouchableNativeFeedback.Ripple(RIPPLE_COLOR, true, CONTROL_RIPPLE_RADIUS)}
                onPress={() => {
                  if (isPlaying) {
                    playButtonRef.current?.play(33, 67);
                  } else {
                    playButtonRef.current?.play(0, 33);
                  }
                  togglePlayback();
                }}>
                <View>
                  <AnimatedLottieView
                    ref={playButtonRef}
                    style={{height: 80, width: 80}}
                    source={require('./../../icons/play_pause.json')}
                    loop={false}
                    speed={2}
                  />
                </View>
              </TouchableNativeFeedback>
              <TouchableNativeFeedback
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                background={TouchableNativeFeedback.Ripple(RIPPLE_COLOR, true, CONTROL_RIPPLE_RADIUS)}
                onPress={skipToNext}>
                <View>
                  <MaterialIcon name="skip-next" size={55} color="#fff" />
                </View>
              </TouchableNativeFeedback>
            </View>
            <TouchableNativeFeedback
              hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
              background={TouchableNativeFeedback.Ripple(RIPPLE_COLOR, true, CONTROL_RIPPLE_RADIUS)}
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
          </View>
        </View>
      </PlayerBackground>
      <PlayingSongBottomSheet ref={playingSongBottonSheetRef} />
    </View>
  );
};

const NORMAL_ICON_SIZE = 28;
const RIPPLE_COLOR = '#cccccc55';
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
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  imageContainer: {
    flex: 7,
    // backgroundColor: '#a2a222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageView: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.7,
    shadowRadius: 2,
    borderRadius: 1000,
    elevation: 20,
  },
  metadataContainer: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  metadata: {
    // backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    flex: 2,
    // backgroundColor: '#712722',
    paddingHorizontal: 25,
  },
  slider: {
    height: 40,
    width: '100%',
  },
  controlContainer: {
    flex: 3,
    // backgroundColor: 'gray',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  playbackControl: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 15,
  },
});
