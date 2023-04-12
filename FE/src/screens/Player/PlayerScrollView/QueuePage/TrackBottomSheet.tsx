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
import TrackPlayer, {Track} from 'react-native-track-player';

import {COLORS} from '../../../../constants';
import {useLoadingModal} from '../../../../contexts/LoadingModalContext';
import {DownloadIcon} from '../../../../icons/DownloadIcon';
import {ShareIcon} from '../../../../icons/ShareIcon';
import {TrashIcon} from '../../../../icons/TrashIcon';
import FileSystem from '../../../../FileSystem';
import {ZingMp3} from '../../../../ZingMp3';

interface Props {
  selectedTrack: Track;
  tracks: Track[];
  setTracks: (tracks: Track[]) => void;
}

export const TrackBottomSheet = forwardRef<BottomSheetModal, Props>(
  ({selectedTrack, tracks, setTracks}, ref) => {
    const {setLoading} = useLoadingModal();
    const snapPoints = React.useMemo(() => ['50%', '90%'], []);

    const handleRemoveTrackFromQueue = async () => {
      try {
        const queue = await TrackPlayer.getQueue();
        await TrackPlayer.remove([queue.findIndex(track => track.id === selectedTrack.id)]);
        setTracks(queue.filter(track => track.id !== selectedTrack.id));
        ToastAndroid.show('Xóa thành công', ToastAndroid.SHORT);
      } catch (error) {
        console.log('handleDeleteTrack', error);
        ToastAndroid.show('Có lỗi xảy ra khi xóa bài hát', ToastAndroid.SHORT);
      } finally {
        setLoading(false);
      }
    };

    const handledownloadTrack = async (track: Track) => {
      try {
        // URL gọi từ ZingMp3 nếu đang là '' còn nếu là bài offline thì throw error
        let url;

        if (String(track.url).includes('http')) {
          url = track.url;
        } else if (!track.url) {
          const data = await ZingMp3.getSong(track.id);
          url = data.data['128'];
        } else {
          throw new Error('URL bị lỗi, hoặc là bài hát offline');
        }

        ToastAndroid.show('Đang tải ' + track.title, ToastAndroid.SHORT);
        await FileSystem.downloadFileToExternalStorage(url, track.id + '.mp3');
        ToastAndroid.show('Đã tải ' + track.title, ToastAndroid.SHORT);
      } catch (error) {
        console.log(error);
        ToastAndroid.show('Có lỗi xảy ra khi tải về', ToastAndroid.SHORT);
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
              paddingVertical: 15,
              gap: 10,
              alignItems: 'center',
            }}>
            <View style={{position: 'relative', width: 45, height: 45}}>
              <Image
                source={require('./../../../../../assets/default_song_thumbnail.png')}
                style={{width: 45, height: 45, borderRadius: 7, position: 'absolute'}}
              />
              <Image
                source={
                  (typeof selectedTrack.artwork === 'string'
                    ? {uri: selectedTrack.artwork}
                    : selectedTrack.artwork) ||
                  require('./../../../../../assets/default_song_thumbnail.png')
                }
                style={{width: 45, height: 45, borderRadius: 7, position: 'absolute'}}
              />
            </View>
            <View style={{marginRight: 'auto'}}>
              <Text style={{fontSize: 15, color: COLORS.TEXT_PRIMARY}}>
                {selectedTrack.title && selectedTrack.title.length > 30
                  ? selectedTrack.title.substring(0, 30) + '...'
                  : selectedTrack.title}
              </Text>
              <Text style={{fontSize: 13, color: COLORS.TEXT_GRAY}}>
                {selectedTrack.artist && selectedTrack.artist.length > 40
                  ? selectedTrack.artist.substring(0, 40) + '...'
                  : selectedTrack.artist}
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
          <TouchableNativeFeedback
            onPress={() => {
              handledownloadTrack(selectedTrack);
              ((ref as any).current as any).close();
            }}>
            <View style={styles.option}>
              <DownloadIcon size={ICON_SIZE} color={COLORS.TEXT_PRIMARY} />
              <Text style={styles.optionText}>Tải về</Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback
            onPress={() => {
              handleRemoveTrackFromQueue();
              ((ref as any).current as any).close();
            }}>
            <View style={styles.option}>
              <TrashIcon size={ICON_SIZE} color={COLORS.TEXT_PRIMARY} />
              <Text style={styles.optionText}>Xóa bài hát khỏi danh sách phát</Text>
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
