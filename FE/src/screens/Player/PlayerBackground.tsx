// @ts-ignore
import flattenStyle from 'react-native/Libraries/StyleSheet/flattenStyle';

import React, {useEffect} from 'react';
import {Animated, Image, StyleSheet, View} from 'react-native';
import {usePlayer} from '../../contexts/PlayerContext';

interface Props {
  children: React.ReactNode;
}

const PlayerBackground = ({children}: Props) => {
  const {
    currentTrack: {artwork},
    lastArtwork,
    setLastArtwork,
  } = usePlayer();

  // Fade animation
  const [fadeAnim] = React.useState(new Animated.Value(1));

  const imageTransition = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(({finished}) => {
      if (finished) {
        setLastArtwork(artwork as string);
        fadeAnim.setValue(1);
      }
    });
  };

  const flattenedStyle = flattenStyle(styles.container);

  return (
    <View accessibilityIgnoresInvertColors={true} style={styles.container}>
      <Image
        source={
          (typeof artwork === 'string' ? {uri: artwork} : artwork) ||
          require('./../../../assets/default.png')
        }
        resizeMode="cover"
        style={[StyleSheet.absoluteFill, {width: flattenedStyle?.width, height: flattenedStyle?.height}]}
        blurRadius={20}
        onLoadEnd={() => {
          if (lastArtwork !== artwork) {
            imageTransition();
          }
        }}
      />
      <Animated.Image
        source={
          (typeof lastArtwork === 'string' ? {uri: lastArtwork} : lastArtwork) ||
          require('./../../../assets/default.png')
        }
        resizeMode="cover"
        style={[
          StyleSheet.absoluteFill,
          {width: flattenedStyle?.width, height: flattenedStyle?.height},
          {opacity: fadeAnim},
        ]}
        blurRadius={20}
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
});

export default PlayerBackground;
