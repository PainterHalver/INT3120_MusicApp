import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, View, Dimensions, TouchableNativeFeedback, Text} from 'react-native';
import {usePlayer} from '../../../contexts/PlayerContext';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import SpinningDisc from '../../../components/SpinningDisc';
import {HeartIcon} from '../../../icons/HeartIcon';
import {ShareIcon} from '../../../icons/ShareIcon';
import {PanGestureHandler, ScrollView} from 'react-native-gesture-handler';
import {COLORS, SIZES} from '../../../constants';
import {ZingMp3} from '../../../ZingMp3';
import TrackPlayer, {Event, Track} from 'react-native-track-player';
import {Song, tracksToSongs} from '../../../types';
import ItemSongResult from '../../../components/ItemSongResult';
import {addEventListener} from 'react-native-track-player/lib/trackPlayer';
import {LyricsPage} from './LyricsPage';
import {MemoizedQueuePage, QueuePage} from './QueuePage';
import {MainPage} from './MainPage';

interface Props {
  translateX: Animated.SharedValue<number>;
}

const PlayerScrollView = ({translateX}: Props) => {
  // SCROLL HANDLING
  const pageCount = 3;
  const maxTranslateX = (pageCount - 1) * -SIZES.SCREEN_WIDTH;

  const onGestureEvent = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startX = translateX.value;
    },
    onActive: (event, ctx: any) => {
      const nextTranslation = ctx.startX + event.translationX;

      if (nextTranslation > 0 || nextTranslation < maxTranslateX) {
        return;
      }

      translateX.value = nextTranslation;
    },
    onEnd: event => {
      const snapPoint = Math.round(translateX.value / SIZES.SCREEN_WIDTH) * SIZES.SCREEN_WIDTH;
      const swipeVelocity = Math.abs(event.velocityX);

      // Scroll có momentum
      if (swipeVelocity > 500) {
        // threshold for momentum scrolling
        const direction = event.velocityX > 0 ? 1 : -1;
        const nextPage = Math.round(translateX.value / SIZES.SCREEN_WIDTH) + direction;
        const targetTranslateX = Math.max(Math.min(nextPage * SIZES.SCREEN_WIDTH, 0), maxTranslateX); // clamp to bounds

        translateX.value = withSpring(targetTranslateX, {
          overshootClamping: true,
          restSpeedThreshold: 0.1,
          restDisplacementThreshold: 0.1,
          damping: 20,
          mass: 0.5,
          stiffness: 100,
          velocity: event.velocityX,
        });
      } else {
        // Scroll không có momentum (drag)
        const clampedSnapPoint = Math.max(Math.min(snapPoint, 0), maxTranslateX); // clamp to bounds

        translateX.value = withSpring(clampedSnapPoint, {
          overshootClamping: true,
          restSpeedThreshold: 0.1,
          restDisplacementThreshold: 0.1,
          damping: 20,
          mass: 0.5,
          stiffness: 100,
          velocity: event.velocityX,
        });
      }
    },
  });

  const rTranslateX = useAnimatedStyle(() => {
    return {
      transform: [{translateX: translateX.value}],
    };
  });

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent} activeOffsetX={[-10, 10]}>
      <Animated.View style={[styles.scrollView, rTranslateX]}>
        {/* PAGE 1: Current playing queue */}
        <MemoizedQueuePage />

        {/* PAGE 2 */}
        <MainPage />

        {/* PAGE 3 */}
        <LyricsPage />
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    flexDirection: 'row',
    width: SIZES.SCREEN_WIDTH * 2,
  },
});

export default PlayerScrollView;
