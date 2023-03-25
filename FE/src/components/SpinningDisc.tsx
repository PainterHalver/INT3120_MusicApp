import React, {useEffect} from 'react';
import {Animated, Easing, Image, StyleSheet} from 'react-native';
import Reanimated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {usePlayer} from '../contexts/PlayerContext';

interface Props {
  size: number;
}

const SpinningDisc = ({size}: Props) => {
  const {
    currentTrack: {artwork},
    isPlaying,
    rotation,
    pausedRotationValue,
    setPausedRotationValue,
    isRotating,
    setIsRotating,
    lastArtwork,
    setLastArtwork,
  } = usePlayer();

  const DISC_DURATION = 20000; // 20 seconds

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(rotation, {
        toValue: 360,
        duration: DISC_DURATION,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    if (isPlaying && !isRotating) {
      rotation.stopAnimation();
      if (pausedRotationValue === 0) {
        animation.start();
      } else {
        // Resume the animation from the paused rotation value immediately
        Animated.timing(rotation, {
          toValue: 359.99, // để phòng edge cases
          duration: ((360 - pausedRotationValue) / 360) * DISC_DURATION,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start(({finished}) => {
          if (finished) {
            // Set up the beginning loop again after the animation finishes
            rotation.resetAnimation();
            animation.start();
          }
        });
      }
      setIsRotating(true);
    } else if (!isPlaying && isRotating) {
      // Pause the animation and store the current rotation value in the state
      animation.stop();
      rotation.stopAnimation(value => {
        setPausedRotationValue(value % 360);
      });
      setIsRotating(false);
    }
  }, [isPlaying, isRotating]);

  const spin = rotation.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

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

  return (
    <Animated.View
      style={[{height: size, width: size}, {transform: [{rotate: spin}, {perspective: 1000}]}]}>
      <Image
        source={
          (typeof artwork === 'string' ? {uri: artwork} : artwork) ||
          require('./../../assets/default.png')
        }
        style={[styles.image, {height: size, width: size}]}
        onLoadEnd={() => {
          if (lastArtwork !== artwork) {
            imageTransition();
          }
        }}
      />
      <Reanimated.Image
        source={
          (typeof lastArtwork === 'string' ? {uri: lastArtwork} : lastArtwork) ||
          require('./../../assets/default.png')
        }
        style={[styles.image, {height: size, width: size}, rFade]}
        onLoadEnd={() => {
          if (lastArtwork === artwork) {
            fadeAnim.value = 1;
          }
        }}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {},
  image: {
    borderRadius: 1000,
    position: 'absolute',
  },
});

export default SpinningDisc;
