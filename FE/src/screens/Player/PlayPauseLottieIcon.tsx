// @refresh reset

import React from 'react';
import {View, TouchableNativeFeedback} from 'react-native';
import AnimatedLottieView from 'lottie-react-native';
import Animated, {useAnimatedProps, useSharedValue, withTiming} from 'react-native-reanimated';

import {usePlayer} from '../../contexts/PlayerContext';
import TrackPlayer from 'react-native-track-player';

export const PlayPauseLottieIcon = () => {
  const buttonRef = React.useRef<AnimatedLottieView>(null);
  const {isPlaying} = usePlayer();
  const [transitioning, setTransitioning] = React.useState(false);

  React.useEffect(() => {
    if (!transitioning) {
      if (isPlaying) {
        buttonRef.current?.play(35, 35);
      } else {
        buttonRef.current?.play(0, 0);
      }
    }
  }, [isPlaying]);

  return (
    <TouchableNativeFeedback
      background={TouchableNativeFeedback.Ripple('#cccccc55', true, 45)}
      useForeground
      onPress={async () => {
        if (isPlaying) {
          await TrackPlayer.pause();
          setTransitioning(true);
          buttonRef.current?.pause();
          buttonRef.current?.play(35, 60);
        } else {
          await TrackPlayer.play();
          setTransitioning(true);
          buttonRef.current?.pause();
          buttonRef.current?.play(0, 25);
        }
      }}>
      <View style={{width: 80, height: 80}}>
        <AnimatedLottieView
          ref={buttonRef}
          source={require('./../../icons/play_pause.json')}
          loop={false}
          speed={2}
          onAnimationFinish={() => {
            setTransitioning(false);
          }}
        />
      </View>
    </TouchableNativeFeedback>
  );
};
