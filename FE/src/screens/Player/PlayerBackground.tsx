// @ts-ignore
import flattenStyle from 'react-native/Libraries/StyleSheet/flattenStyle';

import React, {useEffect} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {usePlayer} from '../../contexts/PlayerContext';
import Animated, {runOnJS, useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';

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
  const fadeAnim = useSharedValue(1);

  const rFade = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: fadeAnim.value,
    };
  });

  const imageTransition = () => {
    'worklet';
    fadeAnim.value = withTiming(0, {duration: 500}, () => {
      runOnJS(setLastArtwork)(artwork as string);
      // fadeAnim.value = withTiming(1, {duration: 500});
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
        onLoadEnd={() => {
          if (lastArtwork === artwork) {
            fadeAnim.value = 1;
          }
        }}
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
