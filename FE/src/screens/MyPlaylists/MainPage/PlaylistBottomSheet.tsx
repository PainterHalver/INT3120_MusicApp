import {BottomSheetBackdrop, BottomSheetModal} from '@gorhom/bottom-sheet';
import React, {forwardRef} from 'react';
import {Image, StyleSheet, Text, TouchableNativeFeedback, View, ToastAndroid, Alert} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import firestore from '@react-native-firebase/firestore';

import {COLORS} from '../../../constants';
import {useLoadingModal} from '../../../contexts/LoadingModalContext';
import {EditIcon} from '../../../icons/EditIcon';
import {ShareIcon} from '../../../icons/ShareIcon';
import {TrashIcon} from '../../../icons/TrashIcon';
import {MyPlaylist} from '../../../types';
import {usePlaylist} from '../../../contexts/PlaylistContext';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useAuth} from '../../../contexts/AuthContext';

interface Props {
  selectedPlaylist: MyPlaylist;
  setEditPlaylistModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PlaylistBottomSheet = forwardRef<BottomSheetModal, Props>(
  ({selectedPlaylist, setEditPlaylistModalVisible}, ref) => {
    const {setLoading} = useLoadingModal();
    const {setPlaylists} = usePlaylist();
    const snapPoints = React.useMemo(() => ['50%', '90%'], []);
    const {user} = useAuth();
    const handleDeletePlaylist = async () => {
      try {
        setLoading(true);
        await firestore().collection('playlists').doc(selectedPlaylist.id).delete();
        setPlaylists(prevPlaylists => {
          return prevPlaylists.filter(playlist => playlist.id !== selectedPlaylist.id);
        });
        ToastAndroid.show('Đã xóa playlist', ToastAndroid.SHORT);
      } catch (error) {
        console.log(error);
        ToastAndroid.show('Có lỗi khi xóa playlist', ToastAndroid.SHORT);
      } finally {
        setLoading(false);
      }
    };

    return (
      <BottomSheetModal
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
              paddingVertical: 20,
              gap: 10,
              alignItems: 'center',
            }}>
            <Image
              source={require('../../../../assets/default_song_thumbnail.png')}
              style={{width: 45, height: 45, borderRadius: 7}}
            />
            <View style={{marginRight: 'auto'}}>
              <Text style={{color: COLORS.TEXT_PRIMARY, fontSize: 16}}>{selectedPlaylist.name}</Text>
            </View>
          </View>
          <View style={styles.hr} />
        </View>
        <View style={styles.options}>
          {user && user.uid === selectedPlaylist.uid && (
            <TouchableOpacity
              onPress={() => {
                Clipboard.setString(`http://mobile3year.com/sharedplaylist/${selectedPlaylist.id}`);
                ToastAndroid.show(
                  `Đã copy http://mobile3year.com/sharedplaylist/${selectedPlaylist.id}`,
                  ToastAndroid.SHORT,
                );
              }}>
              <View style={styles.option}>
                <ShareIcon size={ICON_SIZE} color={COLORS.TEXT_PRIMARY} />
                <Text style={styles.optionText}>Chia sẻ liên kết</Text>
              </View>
            </TouchableOpacity>
          )}
          <TouchableNativeFeedback
            onPress={() => {
              setEditPlaylistModalVisible(true);
              ((ref as any).current as any).close();
            }}>
            <View style={styles.option}>
              <EditIcon size={ICON_SIZE} color={COLORS.TEXT_PRIMARY} />
              <Text style={styles.optionText}>Chỉnh sửa playlist</Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback
            onPress={() => {
              ((ref as any).current as any).close();
              Alert.alert('Xóa playlist', 'Bạn có chắc muốn xóa playlist này không?', [
                {
                  text: 'Hủy',
                  style: 'cancel',
                },
                {
                  text: 'Đồng ý',
                  style: 'destructive',
                  onPress: () => handleDeletePlaylist(),
                },
              ]);
            }}>
            <View style={styles.option}>
              <TrashIcon size={ICON_SIZE} color={COLORS.TEXT_PRIMARY} />
              <Text style={styles.optionText}>Xóa Playlist</Text>
            </View>
          </TouchableNativeFeedback>
        </View>
      </BottomSheetModal>
    );
  },
);

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
