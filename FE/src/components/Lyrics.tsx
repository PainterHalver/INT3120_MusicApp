import { Text, View, Animated, StyleSheet } from 'react-native';
import { memo, useEffect, useMemo, useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';

import { COLORS, SIZES } from '../constants';
import { usePlayer, lineLyric, word } from '../contexts/PlayerContext';
import { useProgress } from 'react-native-track-player';


const HEIGHTLINE = 24;

export const Lyrics = memo(() => {
    const progress = useProgress(150);
    const { lyrics } = usePlayer();
    const [currentWord, setCurrentWord] = useState({ line: 0, index: 0 });
    const currentTime = progress.position * 1000;
    const widthAnimation = new Animated.Value(0);

    Animated.timing(widthAnimation, {
        toValue: 1,
        duration: lyrics && lyrics.length > 0 ? lyrics[currentWord.line].words[currentWord.index].endTime - lyrics[currentWord.line].words[currentWord.index].startTime : 0,
        useNativeDriver: false,
    }).start();

    const animatedStyle = {
        width: widthAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '100%'],
        }),
    };

    console.log('change progress')

    useEffect(() => {
        if (lyrics && lyrics.length > 0) {
            if (currentTime > lyrics[currentWord.line].words[currentWord.index].endTime) {
                let check = true;
                for (let i = currentWord.line; i < lyrics.length; i++) {
                    if (check === false) break
                    const j = lyrics[i].words.length
                    for (let k = 0; k < j; k++) {
                        if (lyrics[i].words[k].endTime > currentTime && lyrics[i].words[k].startTime < currentTime) {
                            setCurrentWord({ line: i, index: k })
                            check = false
                            break;
                        }
                    }
                }
            }
        }
    }, [currentTime])


    const LyricsRender = useMemo(() => {
        if (lyrics.length > 0) {
            console.log(`rerender lyrics ${lyrics[currentWord.line].words[currentWord.index].data}`);
        }
        return (
            <View style={{ width: '100%' }}>
                {lyrics.map((lyric, i) => {
                    return (
                        <View>
                            <View style={{ display: 'flex', flexDirection: 'row', gap: 5 }} key={String(i)}>
                                {lyric.words.map((word, j) => {
                                    return (
                                        <View style={{ overflow: 'hidden', position: 'relative' }}>
                                            <Text
                                                style={[
                                                    styles.word,
                                                    { color: (i < currentWord.line || (i === currentWord.line && j < currentWord.index)) ? COLORS.TEXT_YELLOW : COLORS.TEXT_WHITE_SECONDARY },
                                                ]}>
                                                {word.data}
                                            </Text>
                                            {j === currentWord.index && i === currentWord.line && (
                                                <Animated.View
                                                    style={[animatedStyle, { height: HEIGHTLINE, overflow: 'hidden', position: 'absolute' }]}>
                                                    <Text style={[styles.word, { position: 'absolute', color: COLORS.TEXT_YELLOW }]}>
                                                        {word.data}
                                                    </Text>
                                                </Animated.View>
                                            )}
                                        </View>
                                    );
                                })}
                            </View>
                        </View>
                    )
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
