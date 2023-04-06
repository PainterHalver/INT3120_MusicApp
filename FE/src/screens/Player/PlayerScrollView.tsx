import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, View, Dimensions, TouchableNativeFeedback, Text} from 'react-native';
import {usePlayer} from '../../contexts/PlayerContext';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import SpinningDisc from '../../components/SpinningDisc';
import {HeartIcon} from '../../icons/HeartIcon';
import {ShareIcon} from '../../icons/ShareIcon';
import {PanGestureHandler, ScrollView} from 'react-native-gesture-handler';
import {COLORS} from '../../constants';
import {ZingMp3} from '../../ZingMp3';

const screenWidth = Dimensions.get('window').width;

interface Props {
  translateX: Animated.SharedValue<number>;
}

const PlayerScrollView = ({translateX}: Props) => {
  const {currentTrack} = usePlayer();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  // TODO: Implement this
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  // SCROLL HANDLING
  const pageCount = 3;
  const maxTranslateX = (pageCount - 1) * -screenWidth;

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
      const snapPoint = Math.round(translateX.value / screenWidth) * screenWidth;
      const swipeVelocity = Math.abs(event.velocityX);

      // Scroll có momentum
      if (swipeVelocity > 500) {
        // threshold for momentum scrolling
        const direction = event.velocityX > 0 ? 1 : -1;
        const nextPage = Math.round(translateX.value / screenWidth) + direction;
        const targetTranslateX = Math.max(Math.min(nextPage * screenWidth, 0), maxTranslateX); // clamp to bounds

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
        {/* PAGE 1 */}
        <View style={{width: screenWidth, backgroundColor: 'cyan'}}></View>

        {/* PAGE 2 */}
        <View style={{width: screenWidth}}>
          <View style={styles.imageContainer}>
            <View style={styles.imageView}>
              <SpinningDisc size={screenWidth * 0.82} />
            </View>
          </View>
          <View style={styles.metadataContainer}>
            <TouchableNativeFeedback
              hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
              background={TouchableNativeFeedback.Ripple(RIPPLE_COLOR, true, CONTROL_RIPPLE_RADIUS)}>
              <View>
                <ShareIcon size={21} color="#ffffffaa" />
              </View>
            </TouchableNativeFeedback>
            <View style={styles.metadata}>
              <Text style={{color: '#fff', fontSize: 18, fontWeight: '600'}}>
                {currentTrack.title && currentTrack.title.length > 25
                  ? currentTrack.title.substring(0, 25) + '...'
                  : currentTrack.title}
              </Text>
              <Text style={{color: '#ffffffbb', fontSize: 16}}>
                {currentTrack.artist && currentTrack.artist.length > 30
                  ? currentTrack.artist.substring(0, 30) + '...'
                  : currentTrack.artist}
              </Text>
            </View>
            <TouchableNativeFeedback
              hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
              background={TouchableNativeFeedback.Ripple(RIPPLE_COLOR, true, CONTROL_RIPPLE_RADIUS)}
              onPress={toggleFavorite}>
              <View>
                {isFavorite ? (
                  <HeartIcon size={25} color={ICON_ACTIVATED_COLOR} fill={ICON_ACTIVATED_COLOR} />
                ) : (
                  <HeartIcon size={25} color="#ffffffaa" />
                )}
              </View>
            </TouchableNativeFeedback>
          </View>
        </View>

        {/* PAGE 3 */}
        <LyricsPage />
      </Animated.View>
    </PanGestureHandler>
  );
};

const LyricsPage = () => {
  const {currentTrack, lyrics, setLyrics} = usePlayer();

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
        <View style={{position: 'relative', width: 45, height: 45}}>
          <Image
            source={
              (typeof currentTrack.artwork === 'string'
                ? {uri: currentTrack.artwork}
                : currentTrack.artwork) || require('./../../../assets/default.png')
            }
            style={{width: 45, height: 45, borderRadius: 7}}
          />
        </View>
        <View style={{marginRight: 'auto'}}>
          <Text style={{fontSize: 15, fontWeight: '500', color: COLORS.TEXT_WHITE_PRIMARY}}>
            {currentTrack.title && currentTrack.title.length > 33
              ? currentTrack.title.substring(0, 33) + '...'
              : currentTrack.title}
          </Text>
          <Text style={{fontSize: 14, color: COLORS.TEXT_WHITE_SECONDARY}}>
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
        {lyrics.map((sentence, index) => {
          return (
            <Text
              key={index}
              style={{
                color: COLORS.TEXT_WHITE_SECONDARY,
                fontSize: 20,
                paddingVertical: 10,
                fontWeight: '600',
              }}>
              {sentence}
            </Text>
          );
        })}
      </ScrollView>
    </View>
  );
};

const RIPPLE_COLOR = '#cccccc55';
const CONTROL_RIPPLE_RADIUS = 45;
const ICON_ACTIVATED_COLOR = '#f43a5a';

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    flexDirection: 'row',
    width: screenWidth * 2,
  },
  imageContainer: {
    flex: 7,
    // backgroundColor: '#a2a222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageView: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.7,
    shadowRadius: 2,
    borderRadius: 1000,
    elevation: 20,
  },
  metadataContainer: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 30,
    // backgroundColor: 'orangered',
  },
  metadata: {
    // backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },

  lyricsPage: {
    // backgroundColor: 'cyan',
    width: screenWidth,
    paddingVertical: 15,
  },
});

export default PlayerScrollView;
