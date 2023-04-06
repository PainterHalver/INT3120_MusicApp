import {BottomSheetBackdrop, BottomSheetModal} from '@gorhom/bottom-sheet';
import {View, Text, StyleSheet, Image, TouchableNativeFeedback, ToastAndroid} from 'react-native';
import React, {forwardRef} from 'react';
import {COLORS} from '../../constants';
import {ShareIcon} from '../../icons/ShareIcon';
import {usePlayer} from '../../contexts/PlayerContext';
import {HeartIcon} from '../../icons/HeartIcon';
import {DownloadIcon} from '../../icons/DownloadIcon';
import FileSystem from '../../FileSystem';

interface Props {}

const PlayingSongBottomSheet = forwardRef((props, ref: React.Ref<BottomSheetModal>) => {
  const {currentTrack} = usePlayer();

  const snapPoints = React.useMemo(() => ['50%', '90%'], []);

  const downloadTrack = async () => {
    try {
      if (!currentTrack.url || typeof currentTrack.url !== 'string') {
        throw new Error('Không lấy được link bài hát');
      }

      ToastAndroid.show('Đang tải ' + currentTrack.title, ToastAndroid.SHORT);
      await FileSystem.downloadFileToExternalStorage(currentTrack.url, currentTrack.id + '.mp3');
      ToastAndroid.show('Đã tải ' + currentTrack.title, ToastAndroid.SHORT);
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
      //   onChange={handleSheetChanges}
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
                (typeof currentTrack.artwork === 'string'
                  ? {uri: currentTrack.artwork}
                  : currentTrack.artwork) || require('./../../../assets/default_song_thumbnail.png')
              }
              style={{width: 45, height: 45, borderRadius: 7, position: 'absolute'}}
            />
          </View>
          <View style={{marginRight: 'auto'}}>
            <Text style={{fontSize: 15, color: COLORS.TEXT_PRIMARY}}>
              {currentTrack.title && currentTrack.title.length > 30
                ? currentTrack.title.substring(0, 30) + '...'
                : currentTrack.title}
            </Text>
            <Text style={{fontSize: 13, color: COLORS.TEXT_GRAY}}>
              {currentTrack.artist && currentTrack.artist.length > 40
                ? currentTrack.artist.substring(0, 40) + '...'
                : currentTrack.artist}
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
            downloadTrack();
            (ref as any).current.close();
          }}>
          <View style={styles.option}>
            <DownloadIcon size={ICON_SIZE} color={COLORS.TEXT_PRIMARY} />
            <Text style={styles.optionText}>Tải về</Text>
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback>
          <View style={styles.option}>
            <HeartIcon size={ICON_SIZE} color={COLORS.TEXT_PRIMARY} />
            <Text style={styles.optionText}>Thêm vào thư viện</Text>
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

export default PlayingSongBottomSheet;
