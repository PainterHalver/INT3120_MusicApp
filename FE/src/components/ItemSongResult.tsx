import {View, Text, Image, TouchableNativeFeedback, Keyboard} from 'react-native';
import {useMemo} from 'react';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {Song} from '../types';
import {COLORS} from '../constants';
import {useSongBottomSheetModalContext} from '../contexts/SongBottomSheetModalContext';

type Props = {
  song: Song;
  imageSize?: number;
  variant?: 'text-light' | 'text-dark';
  playing?: boolean;
};
const ItemSongResult = ({song, imageSize = 45, variant = 'text-dark', playing = false}: Props) => {
  const {setSelectedSong, songBottomSheetRef} = useSongBottomSheetModalContext();

  const textPrimaryColor =
    variant === 'text-dark'
      ? COLORS.TEXT_PRIMARY
      : playing
      ? COLORS.RED_PRIMARY
      : COLORS.TEXT_WHITE_PRIMARY;
  const textSecondaryColor = variant === 'text-dark' ? COLORS.TEXT_GRAY : COLORS.TEXT_WHITE_SECONDARY;
  const rippleColor = variant === 'text-dark' ? COLORS.RIPPLE_LIGHT : COLORS.RIPPLE;

  if (!song) return null;

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
        <View style={{position: 'relative', width: imageSize, height: imageSize}}>
          <Image
            source={require('../../assets/default_song_thumbnail.png')}
            style={{width: imageSize, height: imageSize, borderRadius: 7, position: 'absolute'}}
          />
          <Image
            source={{uri: song.thumbnail}}
            style={{width: imageSize, height: imageSize, borderRadius: 7, position: 'absolute'}}
          />
        </View>
        <View style={{marginRight: 'auto'}}>
          <Text style={{fontSize: 13, color: textPrimaryColor}}>
            {song.title && song.title.length > 40 ? song.title.substring(0, 40) + '...' : song.title}
          </Text>
          <Text style={{fontSize: 13, color: textSecondaryColor}}>
            {song.artistsNames && song.artistsNames.length > 40
              ? song.artistsNames.substring(0, 40) + '...'
              : song.artistsNames}
          </Text>
        </View>
        <TouchableNativeFeedback
          hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
          background={TouchableNativeFeedback.Ripple(rippleColor, true, 30)}
          onPress={() => {
            setSelectedSong(song);
            Keyboard.dismiss();
            songBottomSheetRef.current?.present();
          }}>
          <View>
            <IonIcon name="ios-ellipsis-vertical" size={20} color={textSecondaryColor} />
          </View>
        </TouchableNativeFeedback>
      </View>
    ),
    [song, playing],
  );
};

export default ItemSongResult;
