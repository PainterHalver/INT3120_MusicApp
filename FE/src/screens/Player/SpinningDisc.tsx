import React, {useEffect} from 'react';
import {Animated, Easing} from 'react-native';

import {usePlayer} from '../../contexts/PlayerContext';

interface Props {
  size: number;
}

const SpinningDisc = ({size}: Props) => {
  const {currentTrack, isPlaying} = usePlayer();

  const rotation = React.useRef(new Animated.Value(0)).current;
  const [pausedRotationValue, setPausedRotationValue] = React.useState(0);
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

    if (isPlaying) {
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
    } else {
      // Pause the animation and store the current rotation value in the state
      animation.stop();
      rotation.stopAnimation(value => {
        setPausedRotationValue(value % 360);
      });
    }

    return () => {
      animation.stop();
    };
  }, [isPlaying]);

  const spin = rotation.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.Image
      source={currentTrack.artwork || require('./../../../assets/default.png')}
      style={[
        {borderRadius: 1000, height: size, width: size},
        {transform: [{rotate: spin}, {perspective: 1000}]},
      ]}
    />
  );
};

export default SpinningDisc;
