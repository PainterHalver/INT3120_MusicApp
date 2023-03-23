// @ts-ignore
import flattenStyle from 'react-native/Libraries/StyleSheet/flattenStyle';

import React from 'react';
import {Animated, Image, StyleSheet, View} from 'react-native';
import {usePlayer} from '../../contexts/PlayerContext';

interface Props {
  children: React.ReactNode;
}

const PlayerBackground = ({children}: Props) => {
  const {currentTrack} = usePlayer();

  // Fade animation
  const [fadeAnim] = React.useState(new Animated.Value(0));
  const [currentArtwork, setCurrentArtwork] = React.useState<any>(
    currentTrack.artwork || require('./../../../assets/default.png'),
  );

  const imageTransition = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(({finished}) => {
      if (finished) {
        setCurrentArtwork(currentTrack.artwork || require('./../../../assets/default.png'));
        fadeAnim.setValue(1);
      }
    });
  };

  const flattenedStyle = flattenStyle(styles.container);

  return (
    <View accessibilityIgnoresInvertColors={true} style={styles.container}>
      <Image
        source={currentTrack.artwork || require('./../../../assets/default.png')}
        resizeMode="cover"
        style={[StyleSheet.absoluteFill, {width: flattenedStyle?.width, height: flattenedStyle?.height}]}
        blurRadius={30}
        onLoadEnd={() => {
          imageTransition();
        }}
      />
      <Animated.Image
        source={currentArtwork}
        resizeMode="cover"
        style={[
          StyleSheet.absoluteFill,
          {width: flattenedStyle?.width, height: flattenedStyle?.height},
          {opacity: fadeAnim},
        ]}
        blurRadius={30}
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
});

export default PlayerBackground;
