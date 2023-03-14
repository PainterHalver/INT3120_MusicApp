import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  ImageBackground,
  Animated,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {StatusBar, TouchableOpacity} from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import TrackPlayer, {
  Event,
  State,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import Slider from '@react-native-community/slider';
import {StackScreenProps} from '@react-navigation/stack';

import {RootStackParamList} from '../App';

type Props = StackScreenProps<RootStackParamList, 'Player'>;

const Player = ({navigation}: Props) => {
  const playbackState = usePlaybackState();
  const progress = useProgress();
  const [trackTitle, setTrackTitle] = useState<string>('');
  const [trackArtist, setTrackArtist] = useState<string>('');
  const [trackArtwork, setTrackArtwork] = useState<string | number>('');
  const [sliderValue, setSliderValue] = useState<number>(0);
  const [slidingSlider, setSlidingSlider] = useState<boolean>(false);

  // Chỉnh metadata state khi track thay đổi
  // FIXME: Hết track cuối có lỗi
  useTrackPlayerEvents([Event.PlaybackActiveTrackChanged], async event => {
    if (
      event.type === Event.PlaybackActiveTrackChanged &&
      event.index !== undefined
    ) {
      const track = await TrackPlayer.getTrack(event.index);
      if (track) {
        setTrackTitle(track.title || '');
        setTrackArtist(track.artist || '');
        setTrackArtwork(track.artwork || '');
      }
    }
  });

  useTrackPlayerEvents([Event.PlaybackProgressUpdated], async event => {
    if (event.type === Event.PlaybackProgressUpdated) {
      if (!slidingSlider) {
        setSliderValue(event.position);
      }
    }
  });

  useEffect(() => {
    // Set metadata cho track hiện tại, lúc vào player có luôn tên track đầu
    (async () => {
      const currentTrack = await TrackPlayer.getActiveTrackIndex();
      if (currentTrack !== null && currentTrack !== undefined) {
        const track = await TrackPlayer.getTrack(currentTrack);
        if (track) {
          setTrackTitle(track.title || '');
          setTrackArtist(track.artist || '');
          setTrackArtwork(track.artwork || '');
        }
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

  return (
    <View style={styles.containerWrapper}>
      <StatusBar
        barStyle={'light-content'}
        translucent
        backgroundColor={'transparent'}
        animated={true}
      />
      <ImageBackground
        source={
          trackArtwork ? trackArtwork : require('./../assets/default.png')
        }
        resizeMode="cover"
        onLoad={() => {
          console.log('loaded player background image');
        }}
        style={{width: '100%', height: '100%'}}
        blurRadius={4}>
        <View style={styles.container}>
          <View style={styles.heading}>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}>
              <AntDesignIcon
                name="down"
                size={26}
                color="#ddd"
                style={styles.downIcon}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.imageContainer}>
            <Image
              source={
                trackArtwork ? trackArtwork : require('./../assets/default.png')
              }
              style={styles.image}
            />
          </View>
          <View style={styles.metadataContainer}>
            <Text style={{color: '#fff', fontSize: 24, fontWeight: '600'}}>
              {trackTitle}
            </Text>
            <Text style={{color: '#ffffffaa', fontSize: 16}}>
              {trackArtist}
            </Text>
          </View>
          <View style={styles.progressContainer}>
            <Text style={{color: '#fff'}}>
              {Math.floor(sliderValue / 60)
                .toString()
                .padStart(2, '0') +
                ':' +
                Math.floor(sliderValue % 60)
                  .toString()
                  .padStart(2, '0')}
            </Text>
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
            <Text style={{color: '#fff'}}>
              {Math.floor((progress.duration - sliderValue) / 60)
                .toString()
                .padStart(2, '0') +
                ':' +
                Math.floor((progress.duration - sliderValue) % 60)
                  .toString()
                  .padStart(2, '0')}
            </Text>
          </View>
          <View style={styles.controlContainer}>
            <TouchableOpacity onPress={skipToPrevious}>
              <MaterialIcon name="skip-previous" size={45} color="#ddd" />
            </TouchableOpacity>
            <TouchableOpacity onPress={togglePlayback}>
              <AntDesignIcon
                name={
                  playbackState.state === State.Playing
                    ? 'pausecircleo'
                    : 'playcircleo'
                }
                size={55}
                color="#ddd"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={skipToNext}>
              <MaterialIcon name="skip-next" size={45} color="#ddd" />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default Player;

const styles = StyleSheet.create({
  containerWrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    // backgroundColor: 'purple',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  heading: {
    height: 50,
    justifyContent: 'center',
  },
  downIcon: {
    marginLeft: 20,
  },
  imageContainer: {
    flex: 3,
    // backgroundColor: '#a2a222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: '80%',
    aspectRatio: 1,
    borderRadius: 15,
  },
  metadataContainer: {
    flex: 3,
    // backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    flex: 1,
    // backgroundColor: '#712722',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slider: {
    height: 40,
    width: '70%',
  },
  controlContainer: {
    flex: 1,
    // backgroundColor: 'gray',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});
