// @refresh reset

import {memo, useEffect, useMemo, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useProgress} from 'react-native-track-player';
import {COLORS} from '../constants';
import {lineLyric, usePlayer, word as Word} from '../contexts/PlayerContext';
import MaskedView from '@react-native-masked-view/masked-view';
import Animated, {
  Easing,
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const HEIGHTLINE = 24;

let timeout: any;

export const Lyrics = memo(() => {
  const progress = useProgress(500);
  const {lyrics} = usePlayer();

  const position = useSharedValue(0);

  const setCurrentPosition = () => {
    const p = progress.position;
    const d = progress.duration;

    if (p >= 0 && d) {
      position.value = withTiming(p, {
        duration: 500,
        easing: Easing.linear,
      });
    }

    timeout = setTimeout(setCurrentPosition, 500);
  };

  useEffect(() => {
    clearTimeout(timeout);
    setCurrentPosition();
  }, [progress]);

  useEffect(() => {
    console.log('LYRICS CHANGED');
  }, [lyrics]);

  const Word = ({word}: {word: Word}) => {
    const translateX = useDerivedValue(() => {
      const start = word.startTime / 1000;
      const end = word.endTime / 1000 + 0.1;

      return interpolate(position.value, [start, end], [0, word.data.length * 15], Extrapolate.CLAMP);
    });

    const rStyle = useAnimatedStyle(() => {
      return {
        transform: [{translateX: translateX.value}],
      };
    });

    // console.log('WORD:', word.data, word.startTime, word.endTime);

    return (
      <MaskedView
        androidRenderingMode="software"
        style={{backgroundColor: 'yellow', height: 30}}
        maskElement={
          <Text
            // onLayout={e => {
            //   const {x, y, width, height} = e.nativeEvent.layout;
            // }}
            style={{
              color: COLORS.TEXT_WHITE_SECONDARY,
              fontSize: 20,
              fontWeight: '600',
            }}>
            {word.data}{' '}
          </Text>
        }>
        <Text
          style={{
            color: 'transparent',
            fontSize: 20,
            fontWeight: '600',
          }}>
          {word.data}{' '}
        </Text>
        <Animated.View
          style={[
            {
              ...StyleSheet.absoluteFillObject,
              backgroundColor: COLORS.TEXT_WHITE_SECONDARY,
            },
            rStyle,
          ]}
        />
      </MaskedView>
    );
  };

  const MemoizedWord = memo(Word, (prev, next) => {
    return prev.word.data === next.word.data;
  });

  const MemoizedLyrics = useMemo(() => {
    console.log('LYRICS RENDER');
    return (
      <View style={{width: '100%'}}>
        {lyrics.map((line, index) => {
          return (
            <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
              {line.words.map((word, index) => {
                return <MemoizedWord word={word} key={index} />;
              })}
            </View>
          );
        })}
      </View>
    );
  }, [lyrics]);

  return (
    <ScrollView
      bounces={false}
      contentContainerStyle={{
        paddingVertical: 15,
        paddingHorizontal: 20,
      }}>
      {MemoizedLyrics}
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  word: {
    color: COLORS.TEXT_WHITE_SECONDARY,
    fontSize: 20,
    fontWeight: '600',
    lineHeight: HEIGHTLINE,
  },
});
