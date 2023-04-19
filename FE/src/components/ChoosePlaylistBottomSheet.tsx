import {BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import React, {forwardRef} from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
  ToastAndroid,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

import {COLORS} from '../constants';
import {useBottomSheet} from '../contexts/BottomSheetContext';
import {usePlaylist} from '../contexts/PlaylistContext';
import {MyPlaylist} from '../types';
import {useLoadingModal} from '../contexts/LoadingModalContext';

interface Props {}

export const ChoosePlaylistBottomSheet = forwardRef<BottomSheetModal, Props>(({}, ref) => {
  const {selectedSong} = useBottomSheet();
  const {setLoading} = useLoadingModal();
  const {loadingPlaylists, playlists} = usePlaylist();

  const snapPoints = React.useMemo(() => ['50%', '90%'], []);

  const addSelectedSongToPlaylist = async (playlist: MyPlaylist) => {
    try {
      setLoading(true);

      // Check tồn tại bài hát trong playlist
      const querySnapshot = await firestore()
        .collection('playlists')
        .doc(playlist.id)
        .collection('songs')
        .where('encodeId', '==', selectedSong.encodeId)
        .get();

      if (querySnapshot.empty) {
        await firestore().collection('playlists').doc(playlist.id).collection('songs').add(selectedSong);
        ToastAndroid.show('Đã thêm bài hát vào playlist', ToastAndroid.SHORT);
      } else {
        ToastAndroid.show('Bài hát đã tồn tại trong playlist', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log(error);
      ToastAndroid.show('Có lỗi khi thêm bài hát vào playlist', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BottomSheetModal
      name="ChoosePlaylistBottomSheet"
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
        <View style={{alignItems: 'center', justifyContent: 'center', paddingVertical: 15}}>
          <Text style={{fontSize: 18, fontWeight: '600', color: COLORS.TEXT_PRIMARY}}>
            Thêm bài hát vào Playlist
          </Text>
        </View>
        <View style={styles.hr} />
      </View>
      <View style={{flex: 1, marginTop: 10}}>
        <BottomSheetScrollView contentContainerStyle={{paddingBottom: 10}}>
          {loadingPlaylists ? (
            <ActivityIndicator size="large" color={COLORS.RED_PRIMARY} />
          ) : (
            playlists.map((playlist, index) => {
              return (
                <TouchableNativeFeedback
                  key={index}
                  background={TouchableNativeFeedback.Ripple(COLORS.RIPPLE_LIGHT, false)}
                  onPress={() => {
                    addSelectedSongToPlaylist(playlist);
                    (ref as any).current.close();
                  }}>
                  <View>
                    <View
                      style={{
                        paddingHorizontal: 15,
                        paddingVertical: 7,
                        flexDirection: 'row',
                        gap: 10,
                        alignItems: 'center',
                      }}>
                      <Image
                        source={require('../../assets/default_song_thumbnail.png')}
                        style={{width: 45, height: 45, borderRadius: 7}}
                      />
                      <View style={{marginRight: 'auto'}}>
                        <Text style={{color: COLORS.TEXT_PRIMARY, fontSize: 16}}>{playlist.name}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableNativeFeedback>
              );
            })
          )}
        </BottomSheetScrollView>
      </View>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  header: {},
  hr: {
    marginHorizontal: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.BORDER_GRAY,
  },
});

export default ChoosePlaylistBottomSheet;
