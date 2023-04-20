import { Text, View, Animated, StyleSheet } from 'react-native';
import { memo, useEffect, useMemo, useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';

import { COLORS, SIZES } from '../constants';
import { usePlayer, lineLyric, word } from '../contexts/PlayerContext';
import { useProgress } from 'react-native-track-player';


const HEIGHTLINE = 24;

export const Lyrics = memo(() => {
    const progress = useProgress(50);
    const { lyrics } = usePlayer();
    const [currentWord, setCurrentWord] = useState({ line: 0, index: 0 });
    const currentTime = progress.position * 1000;

    useEffect(() => {
        if (lyrics && lyrics.length > 0) {

            const j = lyrics[currentWord.line].words.length - 1;
            if (currentTime > lyrics[currentWord.line].words[currentWord.index].endTime) {
                if (currentWord.index < j) {
                    setCurrentWord({ line: currentWord.line, index: currentWord.index + 1 })
                } else {
                    setCurrentWord({ line: currentWord.line + 1, index: 0 })
                }
            }
        }
    }, [currentTime])


    const animationWord = (word: word) => {
        const widthAnimation = new Animated.Value(0);

        Animated.timing(widthAnimation, {
            toValue: 1,
            duration: word.endTime - word.startTime,
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
                <Text
                    style={[
                        styles.word,
                        { color: word.endTime < currentTime ? COLORS.TEXT_YELLOW : COLORS.TEXT_WHITE_SECONDARY },
                    ]}>
                    {word.data}
                </Text>
                {word.startTime <= currentTime && word.endTime >= currentTime && (
                    <Animated.View
                        style={[animatedStyle, { height: HEIGHTLINE, overflow: 'hidden', position: 'absolute' }]}>
                        <Text style={[styles.word, { position: 'absolute', color: COLORS.TEXT_YELLOW }]}>
                            {word.data}
                        </Text>
                    </Animated.View>
                )}
            </View>
        );
    };

    const LyricRender = ({ line, key }: { line: lineLyric; key: Number }) => {
        return (
            <View style={{ display: 'flex', flexDirection: 'row', gap: 5 }} key={String(key)}>
                {line.words.map((word, index) => {
                    return animationWord(word);
                })}
            </View>
        );
    };

    const LyricsRender = useMemo(() => {
        console.log('rerender lyrics');
        return (
            <View style={{ width: '100%' }}>
                {lyrics.map((lyric, index) => {
                    return <View>{<LyricRender line={lyric} key={index} />}</View>;
                })}
            </View>
        );
    }, [currentWord, lyrics]);

    return (
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
                LyricsRender
            )}
        </ScrollView>)
})


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
