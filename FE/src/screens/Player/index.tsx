// Bắt remount lại component chứ không fast refresh
// @refresh reset

import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  ImageBackground,
  Animated,
  Pressable,
  TouchableNativeFeedback,
  Dimensions,
  Easing,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {StatusBar, TouchableOpacity} from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import TrackPlayer, {
  Event,
  State,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
  RepeatMode,
  Track,
} from 'react-native-track-player';
import Slider from '@react-native-community/slider';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {StackScreenProps} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {RootStackParamList, tracks} from '../../../App';
import {usePlayer} from '../../contexts/PlayerContext';

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

  // Animating image disc
  const rotation = React.useRef(new Animated.Value(0)).current;
  const [pausedRotationValue, setPausedRotationValue] = React.useState(0);
  const DISC_DURATION = 20000; // 20 seconds

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(rotation, {
        toValue: 360,
        duration: DISC_DURATION,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    if (isPlaying) {
      if (pausedRotationValue === 0) {
        animation.start();
      } else {
        // Resume the animation from the paused rotation value immediately
        Animated.timing(rotation, {
          toValue: 359.99, // để phòng edge cases
          duration: ((360 - pausedRotationValue) / 360) * DISC_DURATION,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start(({finished}) => {
          if (finished) {
            // Set up the beginning loop again after the animation finishes
            rotation.resetAnimation();
            animation.start();
          }
        });
      }
    } else {
      // Pause the animation and store the current rotation value in the state
      animation.stop();
      rotation.stopAnimation(value => {
        setPausedRotationValue(value % 360);
      });
    }

    return () => {
      animation.stop();
    };
  }, [isPlaying, pausedRotationValue, rotation]);

  const spin = rotation.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.containerWrapper}>
      <StatusBar
        barStyle={'light-content'}
        translucent
        backgroundColor={'transparent'}
        animated={true}
      />
      <ImageBackground
        source={currentTrack.artwork || require('./../../../assets/default.png')}
        resizeMode="cover"
        style={{width: '100%', height: '100%'}}
        blurRadius={20}>
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
              background={TouchableNativeFeedback.Ripple(RIPPLE_COLOR, true, 23)}>
              <View>
                <MaterialCommunityIcon name="dots-vertical" size={23} color="#fff" />
              </View>
            </TouchableNativeFeedback>
          </View>
          <View style={styles.imageContainer}>
            <View style={styles.imageView}>
              <Animated.Image
                source={currentTrack.artwork || require('./../../../assets/default.png')}
                style={[styles.image, {transform: [{rotate: spin}, {perspective: 1000}]}]}
              />
            </View>
          </View>
          <View style={styles.metadataContainer}>
            <TouchableNativeFeedback
              hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
              background={TouchableNativeFeedback.Ripple(RIPPLE_COLOR, true, CONTROL_RIPPLE_RADIUS)}>
              <View>
                <IonIcon name="share-social-outline" size={NORMAL_ICON_SIZE} color="#ffffffaa" />
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
                <IonIcon
                  name={isFavorite ? 'heart' : 'heart-outline'}
                  size={NORMAL_ICON_SIZE}
                  color={isFavorite ? ICON_ACTIVATED_COLOR : '#ffffffaa'}
                />
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
                <FontAwesomeIcon
                  name="random"
                  size={23}
                  color={isShuffleEnabled ? ICON_ACTIVATED_COLOR : '#ffffffaa'}
                />
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
                onPress={togglePlayback}>
                <View>
                  <AntDesignIcon
                    name={isPlaying ? 'pausecircleo' : 'playcircleo'}
                    size={60}
                    color="#fff"
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
                <MaterialCommunityIcon
                  name={repeatMode === RepeatMode.Track ? 'repeat-once' : 'repeat'}
                  size={27}
                  color={repeatMode === RepeatMode.Off ? '#ffffffaa' : ICON_ACTIVATED_COLOR}
                />
              </View>
            </TouchableNativeFeedback>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const NORMAL_ICON_SIZE = 28;
const RIPPLE_COLOR = '#ccc';
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
    backgroundColor: 'rgba(0,0,0,0.3)',
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
  image: {
    height: width * 0.77,
    width: width * 0.77,
    borderRadius: 1000,
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
