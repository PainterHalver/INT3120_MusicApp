import { Image, StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { COLORS, SIZES } from '../../../constants';
import { lineLyric, usePlayer, word } from '../../../contexts/PlayerContext';
import { Animated } from 'react-native';
import { memo, useMemo, useState } from 'react';
import { useEffect } from 'react';
import { useProgress } from 'react-native-track-player';


const HEIGHTLINE = 24;

export const LyricsPage = memo(() => {
  const progress = useProgress(500);
  const { currentTrack, lyrics } = usePlayer();
  // const [currentWord, setCurrentWord] = useState(1);
  const currentTime = progress.position * 1000;
  // const currentTime = 10000;
  // console.log(progress)
  // const position = useMemo(() => {
  //   const time = useProgress(500);
  // }, [])

  const animationWord = (word: word) => {
    const widthAnimation = new Animated.Value(0);

    Animated.timing(widthAnimation, {
      toValue: 1,
      duration: (word.endTime - word.startTime),
      useNativeDriver: false,
    }).start();

    const animatedStyle = {
      width: widthAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
      }),
    };

    return (
      <View style={{ overflow: 'hidden', position: 'relative' }}>
        <Text style={[styles.word, { color: word.endTime < currentTime ? COLORS.TEXT_YELLOW : COLORS.TEXT_WHITE_SECONDARY }]}>{word.data}</Text>
        {word.startTime <= currentTime && word.endTime >= currentTime && (
          <Animated.View
            style={[animatedStyle, { height: HEIGHTLINE, overflow: 'hidden', position: 'absolute' }]}>
            <Text style={[styles.word, { position: 'absolute', color: COLORS.TEXT_YELLOW }]}>{word.data}</Text>
          </Animated.View>
        )}
      </View>
    );
  };

  const LyricRender = ({ line, key }: { line: lineLyric, key: Number }) => {
    return <View style={{ display: 'flex', flexDirection: 'row', gap: 5 }} key={String(key)} >
      {line.words.map((word, index) => {
        return animationWord(word)
      })}
    </View>;
  };

  console.log('render')

  return (
    <View style={styles.lyricsPage}>
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 7,
          paddingBottom: 15,
          flexDirection: 'row',
          gap: 10,
          alignItems: 'center',
        }}>
        <View style={{ position: 'relative', width: 45, height: 45 }}>
          <Image
            source={
              (typeof currentTrack.artwork === 'string'
                ? { uri: currentTrack.artwork }
                : currentTrack.artwork) || require('./../../../../assets/default.png')
            }
            style={{ width: 45, height: 45, borderRadius: 7 }}
          />
        </View>
        <View style={{ marginRight: 'auto' }}>
          <Text style={{ fontSize: 15, fontWeight: '500', color: COLORS.TEXT_WHITE_PRIMARY }}>
            {currentTrack.title && currentTrack.title.length > 33
              ? currentTrack.title.substring(0, 33) + '...'
              : currentTrack.title}
          </Text>
          <Text style={{ fontSize: 14, color: COLORS.TEXT_WHITE_SECONDARY }}>
            {currentTrack.artist && currentTrack.artist.length > 40
              ? currentTrack.artist.substring(0, 40) + '...'
              : currentTrack.artist}
          </Text>
        </View>
      </View>
      <ScrollView
        bounces={false}
        contentContainerStyle={{
          paddingVertical: 15,
          paddingHorizontal: 20,
        }}>
        {lyrics.length === 0 ? (
          <Text
            style={{
              color: COLORS.TEXT_WHITE_SECONDARY,
              fontSize: 20,
              paddingVertical: 10,
              fontWeight: '600',
            }}>
            {'Không có lời '}
          </Text>
        ) : (
          <View style={{ width: '100%' }}>
            {lyrics.map((lyric, index) => {
              return (<View>
                {<LyricRender line={lyric} key={index} />}
              </View>);
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  lyricsPage: {
    // backgroundColor: 'cyan',
    width: SIZES.SCREEN_WIDTH,
    paddingVertical: 15,
  },
  word: {
    color: COLORS.TEXT_WHITE_SECONDARY,
    fontSize: 20,
    fontWeight: '600',
    lineHeight: HEIGHTLINE,
  },
});
