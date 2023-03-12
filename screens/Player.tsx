import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
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

const Player = () => {
  const playbackState = usePlaybackState();
  const progress = useProgress();
  const [trackTitle, setTrackTitle] = useState<string>('');
  const [trackArtist, setTrackArtist] = useState<string>('');
  const [sliderValue, setSliderValue] = useState<number>(0);
  const [slidingSlider, setSlidingSlider] = useState<boolean>(false);

  // Chỉnh metadata state khi track thay đổi
  // FIXME: Hết track cuối có lỗi
  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
    if (event.type === Event.PlaybackTrackChanged) {
      const track = await TrackPlayer.getTrack(event.nextTrack);
      if (track) {
        setTrackTitle(track.title || '');
        setTrackArtist(track.artist || '');
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
      const currentTrack = await TrackPlayer.getCurrentTrack();
      if (currentTrack !== null) {
        const track = await TrackPlayer.getTrack(currentTrack);
        if (track) {
          setTrackTitle(track.title || '');
          setTrackArtist(track.artist || '');
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
    const state = await TrackPlayer.getState();
    const currentTrack = await TrackPlayer.getCurrentTrack();
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'light-content'} backgroundColor={'purple'} />
      <View style={styles.metadataContainer}>
        <Text style={{color: 'white', fontSize: 24}}>{trackTitle}</Text>
        <Text style={{color: 'white', fontSize: 16}}>{trackArtist}</Text>
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
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#000000"
          onSlidingComplete={async value => {
            setSlidingSlider(false);
            await TrackPlayer.seekTo(value);
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
              playbackState === State.Playing ? 'pausecircleo' : 'playcircleo'
            }
            size={55}
            color="#ddd"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={skipToNext}>
          <MaterialIcon name="skip-next" size={45} color="#ddd" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Player;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'purple',
  },
  metadataContainer: {
    flex: 3,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    flex: 1,
    backgroundColor: '#712722',
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
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'gray',
  },
});
