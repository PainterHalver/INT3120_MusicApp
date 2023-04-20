import {BottomSheetBackdrop, BottomSheetModal} from '@gorhom/bottom-sheet';
import React, {forwardRef} from 'react';
import {
  DeviceEventEmitter,
  Image,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import TrackPlayer, {Track} from 'react-native-track-player';

import FileSystem from '../../FileSystem';
import {COLORS} from '../../constants';
import {useLoadingModal} from '../../contexts/LoadingModalContext';
import {AddToPlayingIcon} from '../../icons/AddToPlayingIcon';
import {PlayNextIcon} from '../../icons/PlayNextIcon';
import {TrashIcon} from '../../icons/TrashIcon';

interface Props {
  selectedTrack: Track;
  setDownloadedTracks: React.Dispatch<React.SetStateAction<Track[]>>;
}

const DownloadedTrackBottomSheet = forwardRef<BottomSheetModal, Props>(
  ({selectedTrack, setDownloadedTracks}, ref) => {
    const {setLoading} = useLoadingModal();
    const snapPoints = React.useMemo(() => ['50%', '90%'], []);

    const handleDeleteTrack = async () => {
      try {
        setLoading(true);

        // Xử lý khi xóa bài đang hát hoặc có trong queue
        const queue = await TrackPlayer.getQueue();
        if (queue.some(track => track.id === selectedTrack.id)) {
          await TrackPlayer.remove([queue.findIndex(track => track.id === selectedTrack.id)]);
        }

        if (typeof selectedTrack.url === 'number') {
          throw new Error('selectedTrack bị lỗi url');
        }

        (ref as any).current.close();
        await FileSystem.deleteFile(selectedTrack.url);
        setDownloadedTracks(await FileSystem.getMusicFiles());
        ToastAndroid.show('Xóa thành công', ToastAndroid.SHORT);
      } catch (error) {
        console.log('handleDeleteTrack', error);
        ToastAndroid.show('Có lỗi xảy ra khi xóa bài hát', ToastAndroid.SHORT);
      } finally {
        setLoading(false);
      }
    };

    const pushTrackToQueue = async (track: Track) => {
      try {
        await TrackPlayer.add(track);
        DeviceEventEmitter.emit('queue-updated');
        ToastAndroid.show('Đã thêm vào queue', ToastAndroid.SHORT);
      } catch (error) {
        console.log(error);
        ToastAndroid.show('Có lỗi xảy ra khi thêm vào queue', ToastAndroid.SHORT);
      }
    };

    const pushTrackToNext = async (track: Track) => {
      try {
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
                source={require('./../../../assets/default_song_thumbnail.png')}
                style={{width: 45, height: 45, borderRadius: 7, position: 'absolute'}}
              />
              <Image
                source={
                  (typeof selectedTrack.artwork === 'string'
                    ? {uri: selectedTrack.artwork}
                    : selectedTrack.artwork) || require('./../../../assets/default_song_thumbnail.png')
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
          </View>
          <View style={styles.hr} />
        </View>
        <View style={styles.options}>
          <TouchableNativeFeedback
            onPress={() => {
              handleDeleteTrack();
              ((ref as any).current as any).close();
            }}>
            <View style={styles.option}>
              <TrashIcon size={ICON_SIZE} color={COLORS.TEXT_PRIMARY} />
              <Text style={styles.optionText}>Xóa file trên thiết bị</Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback
            onPress={() => {
              pushTrackToQueue(selectedTrack);
              ((ref as any).current as any).close();
            }}>
            <View style={styles.option}>
              <AddToPlayingIcon size={ICON_SIZE} color={COLORS.TEXT_PRIMARY} />
              <Text style={styles.optionText}>Thêm vào danh sách phát</Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback
            onPress={() => {
              pushTrackToNext(selectedTrack);
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

export default DownloadedTrackBottomSheet;
