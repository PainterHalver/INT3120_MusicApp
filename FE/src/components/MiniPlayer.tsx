import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useCallback, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import TrackPlayer, { State, usePlaybackState, useProgress } from 'react-native-track-player';
import IonIcon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';

import { RootStackParamList } from '../../App';
import { COLORS } from '../constants';
import { defaultTrack, usePlayer } from '../contexts/PlayerContext';
import { HeartIcon } from '../icons/HeartIcon';
import SpinningDisc from './SpinningDisc';
import { PhoneIcon } from '../icons/PhoneIcon';
import { tracksToSongs } from '../types';
import { useAuth } from '../contexts/AuthContext';

const MiniPlayer = () => {
  const { user } = useAuth();
  const playbackState = usePlaybackState();
  const isPlaying = playbackState.state === State.Playing;
  const {
    currentTrack,
    isLoadingFavorite,
    setIsLoadingFavorite,
    currentTrackIsFavorite,
    setCurrentTrackIsFavorite,
  } = usePlayer();
  const progress = useProgress(250);

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

  const toggleFavorite = async () => {
    try {
      setIsLoadingFavorite(true);
      const favoritePlaylistId = await AsyncStorage.getItem('favoritePlaylistId');
      if (!favoritePlaylistId) {
        throw new Error('Async Storage không lưu favoritePlaylistId');
      }
      const favoriteSongIds = JSON.parse((await AsyncStorage.getItem('favoriteSongEncodeIds')) || '[]');

      if (currentTrackIsFavorite) {
        await firestore()
          .collection('playlists')
          .doc(favoritePlaylistId)
          .collection('songs')
          .where('encodeId', '==', currentTrack.id)
          .get()
          .then(querySnapshot => {
            querySnapshot.docs[0].ref.delete();
          });
        favoriteSongIds.splice(favoriteSongIds.indexOf(currentTrack.id), 1);
        await AsyncStorage.setItem('favoriteSongEncodeIds', JSON.stringify(favoriteSongIds));
        ToastAndroid.show('Đã bỏ thích bài hát', ToastAndroid.SHORT);
      } else {
        await firestore()
          .collection('playlists')
          .doc(favoritePlaylistId)
          .collection('songs')
          .add(tracksToSongs([currentTrack])[0]);
        favoriteSongIds.push(currentTrack.id);
        await AsyncStorage.setItem('favoriteSongEncodeIds', JSON.stringify(favoriteSongIds));
        ToastAndroid.show('Đã thích bài hát', ToastAndroid.SHORT);
      }
      setCurrentTrackIsFavorite(!currentTrackIsFavorite);
    } catch (error) {
      console.log(error);
      ToastAndroid.show('Có lỗi xảy ra khi thích bài hát', ToastAndroid.SHORT);
    } finally {
      setIsLoadingFavorite(false);
    }
  };

  return (
    <View style={{
      display: (currentTrack === defaultTrack || !currentTrack || playbackState.state === State.Stopped) ? 'none' : "flex"
    }}>
      <View style={{ backgroundColor: '#22222233', height: 2, }}>
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
            <Text style={{ fontSize: 13, color: '#000' }}>
              {currentTrack.title && currentTrack.title.length > 30
                ? currentTrack.title.substring(0, 30) + '...'
                : currentTrack.title}
            </Text>
            <Text style={{ fontSize: 13 }}>
              {currentTrack.artist && currentTrack.artist.length > 30
                ? currentTrack.artist.substring(0, 30) + '...'
                : currentTrack.artist}
            </Text>
          </View>
          <View style={styles.controls}>
            <TouchableNativeFeedback
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
              background={TouchableNativeFeedback.Ripple(RIPPLE_COLOR, true, 35)}
              onPress={() => {
                if (currentTrack.url.toString().startsWith('http')) {
                  if (user) {
                    toggleFavorite();
                  } else {
                    ToastAndroid.show('Bạn cần đăng nhập để thích bài hát', ToastAndroid.SHORT);
                  }
                } else {
                  ToastAndroid.show('Nhạc Offline', ToastAndroid.SHORT);
                }
              }}>
              <View>
                {!currentTrack || !currentTrack.url || isLoadingFavorite ? (
                  <ActivityIndicator size={26} color={COLORS.RED_PRIMARY} />
                ) : currentTrack.url.toString().startsWith('http') ? (
                  currentTrackIsFavorite ? (
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
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
              background={TouchableNativeFeedback.Ripple(RIPPLE_COLOR, true, 35)}
              onPress={togglePlayback}>
              <View>
                <IonIcon name={isPlaying ? 'pause' : 'play'} size={27} color={'#000'} />
              </View>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
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
