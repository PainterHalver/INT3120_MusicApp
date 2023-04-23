import {BottomSheetBackdrop, BottomSheetModal} from '@gorhom/bottom-sheet';
import React, {forwardRef} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableNativeFeedback,
  View,
  DeviceEventEmitter,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

import {COLORS} from '../constants';
import {usePlayer} from '../contexts/PlayerContext';
import {AddToPlayingIcon} from '../icons/AddToPlayingIcon';
import {AddToPlaylistIcon} from '../icons/AddToPlaylistIcon';
import {DownloadIcon} from '../icons/DownloadIcon';
import {HeartIcon} from '../icons/HeartIcon';
import {PlayNextIcon} from '../icons/PlayNextIcon';
import {ShareIcon} from '../icons/ShareIcon';
import {Song, songsToTracks} from '../types';
import {ZingMp3} from '../ZingMp3';
import FileSystem from '../FileSystem';
import {useBottomSheet} from '../contexts/BottomSheetContext';
import TrackPlayer from 'react-native-track-player';
import {RemoveFromPlaylistIcon} from '../icons/RemoveFromPlaylistIcon';
import {useLoadingModal} from '../contexts/LoadingModalContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuth} from '../contexts/AuthContext';

interface Props {}

const SongBottomSheet = forwardRef<BottomSheetModal, Props>(({}, ref) => {
  const {setLoading} = useLoadingModal();
  const {selectedSong, playlistBottomSheetRef, selectedSongIsFavorite, setSelectedSongIsFavorite} =
    useBottomSheet();
  const {currentTrack, setCurrentTrackIsFavorite} = usePlayer();
  const {user} = useAuth();

  const snapPoints = React.useMemo(() => ['50%', '90%'], []);

  const removeSelectedSongFromFirebasePlaylist = async () => {
    try {
      setLoading(true);
      await firestore()
        .collection('playlists')
        .doc(selectedSong.firebasePlaylistId)
        .collection('songs')
        .where('encodeId', '==', selectedSong.encodeId)
        .get()
        .then(querySnapshot => {
          querySnapshot.docs[0].ref.delete();
        });
      ToastAndroid.show('Đã xóa bài hát', ToastAndroid.SHORT);
    } catch (error) {
      console.log(error);
      ToastAndroid.show('Có lỗi xảy ra khi xóa bài hát', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavoriteSelectedSong = async () => {
    try {
      const favoritePlaylistId = await AsyncStorage.getItem('favoritePlaylistId');
      if (!favoritePlaylistId) {
        throw new Error('Async Storage không lưu favoritePlaylistId');
      }
      await firestore()
        .collection('playlists')
        .doc(favoritePlaylistId)
        .collection('songs')
        .where('encodeId', '==', selectedSong.encodeId)
        .get()
        .then(async querySnapshot => {
          const favoriteSongIds = JSON.parse(
            (await AsyncStorage.getItem('favoriteSongEncodeIds')) || '[]',
          );
          if (querySnapshot.docs.length === 0) {
            await firestore()
              .collection('playlists')
              .doc(favoritePlaylistId)
              .collection('songs')
              .add(selectedSong);
            favoriteSongIds.push(selectedSong.encodeId);
            await AsyncStorage.setItem('favoriteSongEncodeIds', JSON.stringify(favoriteSongIds));
            ToastAndroid.show('Đã thích bài hát', ToastAndroid.SHORT);
          } else {
            querySnapshot.docs[0].ref.delete();
            favoriteSongIds.splice(favoriteSongIds.indexOf(selectedSong.encodeId), 1);
            await AsyncStorage.setItem('favoriteSongEncodeIds', JSON.stringify(favoriteSongIds));
            ToastAndroid.show('Đã bỏ thích bài hát', ToastAndroid.SHORT);
          }
        });
      setSelectedSongIsFavorite(!selectedSongIsFavorite);

      // Nếu là bài đang phát
      if (currentTrack.id === selectedSong.encodeId) {
        setCurrentTrackIsFavorite(!selectedSongIsFavorite);
      }
    } catch (error) {
      console.log(error);
      ToastAndroid.show('Có lỗi xảy ra khi thích/bỏ thích bài hát', ToastAndroid.SHORT);
    }
  };

  const downloadSong = async (song: Song) => {
    try {
      const data = await ZingMp3.getSong(song.encodeId);
      const url = data.data['128'];

      if (!url) throw new Error('Không lấy được link bài hát');

      ToastAndroid.show('Đang tải ' + song.title, ToastAndroid.SHORT);
      await FileSystem.downloadFileToExternalStorage(url, song.encodeId + '.mp3');
      ToastAndroid.show('Đã tải ' + song.title, ToastAndroid.SHORT);
    } catch (error) {
      console.log(error);
      ToastAndroid.show('Có lỗi xảy ra khi tải về', ToastAndroid.SHORT);
    }
  };

  const pushSongToQueue = async (song: Song) => {
    try {
      const track = songsToTracks([song])[0];
      await TrackPlayer.add(track);
      DeviceEventEmitter.emit('queue-updated');
      ToastAndroid.show('Đã thêm vào queue', ToastAndroid.SHORT);
    } catch (error) {
      console.log(error);
      ToastAndroid.show('Có lỗi xảy ra khi thêm vào queue', ToastAndroid.SHORT);
    }
  };

  const pushSongToNext = async (song: Song) => {
    try {
      const track = songsToTracks([song])[0];
      await TrackPlayer.add(track, ((await TrackPlayer.getActiveTrackIndex()) || 0) + 1);
      DeviceEventEmitter.emit('queue-updated');
      ToastAndroid.show('Đã thêm vào kế tiếp', ToastAndroid.SHORT);
    } catch (error) {
      console.log(error);
      ToastAndroid.show('Có lỗi xảy ra khi thêm vào queue', ToastAndroid.SHORT);
    }
  };

  return (
    <BottomSheetModal
      name="SongBottomSheet"
      enablePanDownToClose
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      backgroundStyle={{backgroundColor: COLORS.BACKGROUND_PRIMARY}}
      style={{}}
      handleStyle={{display: 'none'}}
      backdropComponent={props => (
        <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
      )}>
      <View style={styles.header}>
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 20,
            paddingVertical: 15,
            gap: 10,
            alignItems: 'center',
          }}>
          <View style={{position: 'relative', width: 45, height: 45}}>
            <Image
              source={require('./../../assets/default_song_thumbnail.png')}
              style={{width: 45, height: 45, borderRadius: 7, position: 'absolute'}}
            />
            <Image
              source={
                (typeof selectedSong.thumbnail === 'string'
                  ? {uri: selectedSong.thumbnail}
                  : selectedSong.thumbnail) || require('./../../assets/default_song_thumbnail.png')
              }
              style={{width: 45, height: 45, borderRadius: 7, position: 'absolute'}}
            />
          </View>
          <View style={{marginRight: 'auto'}}>
            <Text style={{fontSize: 15, color: COLORS.TEXT_PRIMARY}}>
              {selectedSong.title && selectedSong.title.length > 30
                ? selectedSong.title.substring(0, 30) + '...'
                : selectedSong.title}
            </Text>
            <Text style={{fontSize: 13, color: COLORS.TEXT_GRAY}}>
              {selectedSong.artistsNames && selectedSong.artistsNames.length > 40
                ? selectedSong.artistsNames.substring(0, 40) + '...'
                : selectedSong.artistsNames}
            </Text>
          </View>
          <View style={{marginRight: 10}}>
            <TouchableNativeFeedback
              hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
              background={TouchableNativeFeedback.Ripple('#00000022', true, 30)}
              useForeground>
              <View>
                <ShareIcon size={21} color={COLORS.TEXT_PRIMARY} />
              </View>
            </TouchableNativeFeedback>
          </View>
        </View>
        <View style={styles.hr} />
      </View>
      <View style={styles.options}>
        {selectedSong.firebasePlaylistId && (
          <TouchableNativeFeedback
            onPress={() => {
              removeSelectedSongFromFirebasePlaylist();
              ((ref as any).current as any).close();
            }}>
            <View style={styles.option}>
              <RemoveFromPlaylistIcon size={ICON_SIZE} color={COLORS.TEXT_PRIMARY} />
              <Text style={styles.optionText}>Xóa khỏi Playlist này</Text>
            </View>
          </TouchableNativeFeedback>
        )}
        <TouchableNativeFeedback
          onPress={() => {
            downloadSong(selectedSong);
            ((ref as any).current as any).close();
          }}>
          <View style={styles.option}>
            <DownloadIcon size={ICON_SIZE} color={COLORS.TEXT_PRIMARY} />
            <Text style={styles.optionText}>Tải về</Text>
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback
          onPress={() => {
            (ref as any).current.dismiss();
            if (user) {
              toggleFavoriteSelectedSong();
            } else {
              ToastAndroid.show('Bạn cần đăng nhập để sử dụng tính năng này', ToastAndroid.SHORT);
            }
          }}>
          <View style={styles.option}>
            {selectedSongIsFavorite ? (
              <HeartIcon size={ICON_SIZE} color={COLORS.RED_PRIMARY} fill={COLORS.RED_PRIMARY} />
            ) : (
              <HeartIcon size={ICON_SIZE} color={COLORS.TEXT_PRIMARY} />
            )}
            <Text style={styles.optionText}>Yêu thích</Text>
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback
          onPress={() => {
            (ref as any).current.dismiss();
            if (user) {
              (playlistBottomSheetRef as any).current.present();
            } else {
              ToastAndroid.show('Bạn cần đăng nhập để sử dụng tính năng này', ToastAndroid.SHORT);
            }
          }}>
          <View style={styles.option}>
            <AddToPlaylistIcon size={ICON_SIZE} color={COLORS.TEXT_PRIMARY} />
            <Text style={styles.optionText}>Thêm vào playlist</Text>
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback
          onPress={() => {
            pushSongToQueue(selectedSong);
            ((ref as any).current as any).close();
          }}>
          <View style={styles.option}>
            <AddToPlayingIcon size={ICON_SIZE} color={COLORS.TEXT_PRIMARY} />
            <Text style={styles.optionText}>Thêm vào danh sách phát</Text>
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback
          onPress={() => {
            pushSongToNext(selectedSong);
            ((ref as any).current as any).close();
          }}>
          <View style={styles.option}>
            <PlayNextIcon size={ICON_SIZE} color={COLORS.TEXT_PRIMARY} />
            <Text style={styles.optionText}>Phát kế tiếp</Text>
          </View>
        </TouchableNativeFeedback>
      </View>
    </BottomSheetModal>
  );
});
const ICON_SIZE = 25;

const styles = StyleSheet.create({
  header: {},
  hr: {
    marginHorizontal: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.BORDER_GRAY,
  },
  options: {
    paddingVertical: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 15,
  },
  optionText: {
    fontSize: 14.5,
    color: COLORS.TEXT_PRIMARY,
  },
});

export default SongBottomSheet;
