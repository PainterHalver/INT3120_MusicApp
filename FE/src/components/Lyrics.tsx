// @refresh reset

import {memo, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useProgress} from 'react-native-track-player';
import {COLORS} from '../constants';
import {usePlayer} from '../contexts/PlayerContext';
import MaskedView from '@react-native-masked-view/masked-view';
import Animated, {Easing, useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';

const HEIGHTLINE = 24;

export const Lyrics = memo(() => {
  const progress = useProgress(150);
  const {lyrics} = usePlayer();

  const translateX = useSharedValue(0);

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: translateX.value}],
    };
  });

  useEffect(() => {}, []);

  return (
    <ScrollView
      bounces={false}
      contentContainerStyle={{
        paddingVertical: 15,
        paddingHorizontal: 20,
        flex: 1,
      }}>
      <MaskedView
        style={{backgroundColor: 'yellow', height: 30}}
        maskElement={
          <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
            {['HAHAH', 'Thoi trang tron'].map((word, index) => {
              return (
                <Text
                  key={index}
                  onLayout={e => {
                    const {x, y, width, height} = e.nativeEvent.layout;
                    console.log(x, y, width, height);
                    translateX.value = withTiming(width + x, {
                      duration: 1000,
                      easing: Easing.linear,
                    });
                  }}
                  style={{
                    color: COLORS.TEXT_WHITE_SECONDARY,
                    fontSize: 20,
                    fontWeight: '600',
                    // backgroundColor: 'red',
                  }}>
                  {word}{' '}
                </Text>
              );
            })}
          </View>
        }>
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
