import {View, Text, Image, TouchableNativeFeedback, Keyboard} from 'react-native';
import {useMemo} from 'react';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {Song} from '../../types';
import {COLORS} from '../../constants';
import {useSongBottomSheetModalContext} from '../../contexts/SongBottomSheetModalContext';
import {Track} from 'react-native-track-player';
import {BottomSheetModal} from '@gorhom/bottom-sheet';

type Props = {
  track: Track;
  variant?: 'text-light' | 'text-dark';
  downloadedTrackBottomSheetRef: React.RefObject<BottomSheetModal>;
  setSelectedTrack: (track: Track) => void;
};
const ItemDownloadedTrackResult = ({
  track,
  variant = 'text-dark',
  downloadedTrackBottomSheetRef,
  setSelectedTrack,
}: Props) => {
  const textPrimaryColor = variant === 'text-dark' ? COLORS.TEXT_PRIMARY : COLORS.TEXT_WHITE_PRIMARY;
  const textSecondaryColor = variant === 'text-dark' ? COLORS.TEXT_GRAY : COLORS.TEXT_WHITE_SECONDARY;
  const rippleColor = variant === 'text-dark' ? COLORS.RIPPLE_LIGHT : COLORS.RIPPLE;

  if (!track) return null;

  return useMemo(
    () => (
      <View
        style={{
          paddingHorizontal: 15,
          paddingVertical: 7,
          flexDirection: 'row',
          gap: 10,
          alignItems: 'center',
        }}>
        <View style={{position: 'relative', width: 45, height: 45}}>
          <Image
            source={require('../../../assets/default_song_thumbnail.png')}
            style={{width: 45, height: 45, borderRadius: 7, position: 'absolute'}}
          />
          <Image
            source={
              track.artwork
                ? {uri: track.artwork}
                : require('../../../assets/default_song_thumbnail.png')
            }
            style={{width: 45, height: 45, borderRadius: 7, position: 'absolute'}}
          />
        </View>
        <View style={{marginRight: 'auto'}}>
          <Text style={{fontSize: 13, color: textPrimaryColor}}>
            {track.title && track.title.length > 40 ? track.title.substring(0, 40) + '...' : track.title}
          </Text>
          <Text style={{fontSize: 13, color: textSecondaryColor}}>
            {track.artist && track.artist.length > 40
              ? track.artist.substring(0, 40) + '...'
              : track.artist}
          </Text>
        </View>
        <TouchableNativeFeedback
          hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
          background={TouchableNativeFeedback.Ripple(rippleColor, true, 30)}
          onPress={() => {
            setSelectedTrack(track);
            downloadedTrackBottomSheetRef.current?.present();
          }}>
          <View>
            <IonIcon name="ios-ellipsis-vertical" size={20} color={textSecondaryColor} />
          </View>
        </TouchableNativeFeedback>
      </View>
    ),
    [track],
  );
};

export default ItemDownloadedTrackResult;
