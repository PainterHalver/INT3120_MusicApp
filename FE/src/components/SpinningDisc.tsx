import React, {useEffect} from 'react';
import {Animated, Easing, Image, StyleSheet} from 'react-native';

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
      <Animated.Image
        source={
          (typeof lastArtwork === 'string' ? {uri: lastArtwork} : lastArtwork) ||
          require('./../../assets/default.png')
        }
        style={[styles.image, {height: size, width: size}, {opacity: fadeAnim}]}
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
