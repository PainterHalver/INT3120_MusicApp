// @refresh reset

import MaskedView from '@react-native-masked-view/masked-view';
import {memo, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Text, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import Animated, {
  Easing,
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useProgress} from 'react-native-track-player';
import {COLORS} from '../constants';
import {LineLyric, Word as WordType, usePlayer} from '../contexts/PlayerContext';

const HEIGHTLINE = 24;

let timeout: any;

const Word = ({word, position}: {word: WordType; position: Animated.SharedValue<number>}) => {
  const translateX = useDerivedValue(() => {
    const start = word.startTime / 1000;
    const end = word.endTime / 1000 + 0.1;

    return interpolate(position.value, [start, end], [0, word.data.length * 17], Extrapolate.CLAMP);
  });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: translateX.value}],
    };
  });

  // console.log('WORD:', word.data, word.startTime, word.endTime);

  return (
    <MaskedView
      style={{backgroundColor: 'yellow', height: 30}}
      maskElement={
        <Text
          style={{
            color: COLORS.TEXT_WHITE_SECONDARY,
            fontSize: 24,
            fontWeight: '600',
          }}>
          {word.data}{' '}
        </Text>
      }>
      <Animated.View style={[{backgroundColor: COLORS.TEXT_WHITE_SECONDARY}, rStyle]}>
        <Text
          style={{
            color: 'transparent',
            fontSize: 24,
            fontWeight: '600',
            letterSpacing: 0.5,
          }}>
          {word.data}{' '}
        </Text>
      </Animated.View>
    </MaskedView>
  );
};

const MemoizedWord = memo(Word, (prev, next) => {
  return prev.word.data === next.word.data;
});

const MemoizedLine = ({
  line,
  lineIndex,
  currentLineIndex,
  scrollViewRef,
  position,
}: {
  line: LineLyric;
  lineIndex: number;
  currentLineIndex: number;
  scrollViewRef: any;
  position: Animated.SharedValue<number>;
}) => {
  return useMemo(() => {
    return (
      <View
        onLayout={e => {
          if (lineIndex === currentLineIndex) {
            console.log(e.nativeEvent.layout);
            scrollViewRef.current?.scrollTo({
              y: e.nativeEvent.layout.y - 100,
              animated: true,
            });
          }
        }}
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          flexWrap: 'wrap',
          marginVertical: 10,
        }}>
        {currentLineIndex === lineIndex ? (
          line.words.map((word, index) => {
            return <MemoizedWord word={word} key={index} position={position} />;
          })
        ) : (
          <Text
            style={{
              color: '#DDDDDD55', // COLORS.TEXT_WHITE_SECONDARY
              fontSize: 24,
              fontWeight: '600',
              letterSpacing: 0.5,
              flexShrink: 1,
            }}>
            {line.words.map(word => word.data).join(' ')}
          </Text>
        )}
      </View>
    );
  }, [currentLineIndex]);
};

export const Lyrics = memo(() => {
  const progress = useProgress(500);
  const {lyrics} = usePlayer();

  const position = useSharedValue(0);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const setCurrentPosition = useCallback(() => {
    const p = progress.position;
    const d = progress.duration;

    if (p >= 0 && d) {
      position.value = withTiming(p, {
        duration: 500,
        easing: Easing.linear,
      });
    }

    timeout = setTimeout(setCurrentPosition, 500);
  }, [progress]);

  useEffect(() => {
    clearTimeout(timeout);
    setCurrentPosition();
    setCurrentLineIndex(
      lyrics.findIndex(line => line.words[0].startTime / 1000 > progress.position) - 1,
    );
  }, [progress]);

  console.log(currentLineIndex);

  useEffect(() => {
    console.log('LYRICS CHANGED');
  }, [lyrics]);

  return (
    <ScrollView
      ref={scrollViewRef}
      contentContainerStyle={{
        paddingHorizontal: 20,
      }}>
      {lyrics.map((line, index) => {
        return (
          <MemoizedLine
            line={line}
            key={index}
            lineIndex={index}
            currentLineIndex={currentLineIndex}
            scrollViewRef={scrollViewRef}
            position={position}
          />
        );
      })}
    </ScrollView>
  );
});
