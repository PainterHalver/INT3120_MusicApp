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

const Word = ({
  word,
  position,
  isLastInLine,
}: {
  word: WordType;
  position: Animated.SharedValue<number>;
  isLastInLine: boolean;
}) => {
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

  return (
    <MaskedView
      style={{backgroundColor: 'yellow', height: 33}}
      maskElement={
        <Text
          style={{
            color: COLORS.TEXT_WHITE_SECONDARY,
            fontSize: 24,
            fontWeight: '600',
            letterSpacing: 0.7,
          }}>
          {word.data}
        </Text>
      }>
      <Animated.View
        style={[
          {
            backgroundColor: COLORS.TEXT_WHITE_SECONDARY,
          },
          rStyle,
        ]}>
        <Text
          style={{
            color: 'transparent',
            fontSize: 24,
            fontWeight: '600',
            letterSpacing: 0.7,
            marginLeft: 5.3,
          }}>
          {word.data}
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
            const test = word.data.split(' ');
            const duration = word.endTime - word.startTime;
            if (test.length > 1) {
              return test.map((w, i) => {
                return (
                  // distribute evenly start and end time
                  <MemoizedWord
                    word={{
                      data: w,
                      startTime: word.startTime + (duration / test.length) * i,
                      endTime: word.startTime + (duration / test.length) * (i + 1),
                    }}
                    key={i}
                    position={position}
                    isLastInLine={i === test.length - 1}
                  />
                );
              });
            }

            return (
              <MemoizedWord
                word={word}
                key={index}
                position={position}
                isLastInLine={index === line.words.length - 1}
              />
            );
          })
        ) : (
          <Text
            style={{
              color: '#DDDDDD55', // COLORS.TEXT_WHITE_SECONDARY
              fontSize: 24,
              fontWeight: '600',
              letterSpacing: 0.5,
              flexShrink: 1,
              lineHeight: 33,
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
