import React, {useEffect, useState, useMemo} from 'react';
import {
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import SpinningDisc from '../../../components/SpinningDisc';
import {usePlayer} from '../../../contexts/PlayerContext';
import {HeartIcon} from '../../../icons/HeartIcon';
import {ShareIcon} from '../../../icons/ShareIcon';
import {COLORS, SIZES} from '../../../constants';
import {PhoneIcon} from '../../../icons/PhoneIcon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {tracksToSongs} from '../../../types';

export const MainPage = () => {
  const {
    currentTrack,
    isLoadingFavorite,
    setIsLoadingFavorite,
    currentTrackIsFavorite,
    setCurrentTrackIsFavorite,
  } = usePlayer();

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

  return useMemo(() => {
    return (
      <View style={{width: SIZES.SCREEN_WIDTH}}>
        <View style={styles.imageContainer}>
          <View style={styles.imageView}>
            <SpinningDisc size={SIZES.SCREEN_WIDTH * 0.82} />
          </View>
        </View>
        <View style={styles.metadataContainer}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
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
              onPress={() => {
                if (currentTrack.url.toString().startsWith('http')) {
                  toggleFavorite();
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
                    <HeartIcon size={25} color="#ffffffaa" />
                  )
                ) : (
                  <PhoneIcon size={25} color="#ffffffaa" />
                )}
              </View>
            </TouchableNativeFeedback>
          </View>
        </View>
      </View>
    );
  }, [currentTrack, currentTrackIsFavorite, isLoadingFavorite]);
};

const RIPPLE_COLOR = '#cccccc55';
const CONTROL_RIPPLE_RADIUS = 45;

const styles = StyleSheet.create({
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
    justifyContent: 'flex-start',
    paddingHorizontal: 30,
    // backgroundColor: 'orangered',
  },
  metadata: {
    // backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
