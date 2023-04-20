import React, {useEffect, useState, useMemo} from 'react';
import {
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import SpinningDisc from '../../../components/SpinningDisc';
import {usePlayer} from '../../../contexts/PlayerContext';
import {HeartIcon} from '../../../icons/HeartIcon';
import {ShareIcon} from '../../../icons/ShareIcon';
import {COLORS, SIZES} from '../../../constants';
import {PhoneIcon} from '../../../icons/PhoneIcon';

export const MainPage = () => {
  const {currentTrack} = usePlayer();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  // TODO: Implement this
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
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
                {!currentTrack || !currentTrack.url ? (
                  <ActivityIndicator size={26} color={COLORS.RED_PRIMARY} />
                ) : currentTrack.url.toString().startsWith('http') ? (
                  isFavorite ? (
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
  }, [currentTrack, isFavorite]);
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
