import {BottomSheetBackdrop, BottomSheetModal} from '@gorhom/bottom-sheet';
import React, {forwardRef} from 'react';
import {Image, StyleSheet, Text, TouchableNativeFeedback, View} from 'react-native';

import {COLORS} from '../constants';
import {usePlayer} from '../contexts/PlayerContext';
import {AddToPlayingIcon} from '../icons/AddToPlayingIcon';
import {AddToPlaylistIcon} from '../icons/AddToPlaylistIcon';
import {DownloadIcon} from '../icons/DownloadIcon';
import {HeartIcon} from '../icons/HeartIcon';
import {PlayNextIcon} from '../icons/PlayNextIcon';
import {ShareIcon} from '../icons/ShareIcon';

interface Props {}

const SongBottomSheet = forwardRef(({}: Props, ref: React.Ref<BottomSheetModal>) => {
  const {selectedSong} = usePlayer();

  const snapPoints = React.useMemo(() => ['50%', '90%'], []);

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
        <TouchableNativeFeedback>
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
        <TouchableNativeFeedback>
          <View style={styles.option}>
            <AddToPlaylistIcon size={ICON_SIZE} color={COLORS.TEXT_PRIMARY} />
            <Text style={styles.optionText}>Thêm vào playlist</Text>
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback>
          <View style={styles.option}>
            <AddToPlayingIcon size={ICON_SIZE} color={COLORS.TEXT_PRIMARY} />
            <Text style={styles.optionText}>Thêm vào danh sách phát</Text>
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback>
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
