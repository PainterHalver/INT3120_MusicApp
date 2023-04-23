//@refresh reset
import {
  View,
  ScrollView,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  SafeAreaView,
  ImageBackground,
  StyleSheet,
  Animated,
} from 'react-native';
import React, { memo, useState, useRef, useEffect } from 'react';
import LinearGradient from 'react-native-linear-gradient';

export type banner = {
  type: number,
  link: string,
  banner: string,
  cover: string,
  target: number,
  title: string,
  description: string,
  ispr: number,
  encodeId: string
}

type Props = {
  data: Array<banner>;
  children: JSX.Element;
};
const Banner = memo(({ data, children }: Props): JSX.Element => {
  const [indexOffset, setIndexOffset] = useState(0);
  const screenWidth = Dimensions.get('window').width - 20;
  const banner = useRef<ScrollView>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const onScrollHandle = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!e) {
      return null;
    }
    const nativeEvent = e.nativeEvent;
    Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })(e);
    if (nativeEvent && nativeEvent.contentOffset) {
      let imageIndex = 0;
      if (nativeEvent.contentOffset.x > 0) {
        imageIndex = Math.floor((nativeEvent.contentOffset.x + screenWidth / 2) / screenWidth);
      }
      setIndexOffset(imageIndex);
    }
  };

  useEffect(() => {
    console.log('i1');
    let i = indexOffset;
    setInterval(() => {
      if (banner !== null && banner.current !== null) {
        banner.current.scrollTo({
          x: i * screenWidth,
          y: 0,
          animated: true,
        });
        i += 1;
        if (i === data.length) {
          i = 0;
          banner.current.scrollTo({
            x: 0,
            y: 0,
            animated: false,
          });
        }
        setIndexOffset(i);
      }
    }, 6000);
  }, [data]);

  return (
    <SafeAreaView>

      <ImageBackground
        source={{ uri: data[indexOffset]?.banner ? data[indexOffset].banner : 'https://photo-zmp3.zmdcdn.me/banner/a/d/a/4/ada41294a80feb2e51d65552835e7e81.jpg' }}
        style={{ backgroundColor: 'red' }}
        blurRadius={50}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          colors={['#FFFFFF00', '#FFFFFF']}
          style={{ paddingHorizontal: 10 }}>
          {children}
          <View>
            <ScrollView
              style={{ height: 200, overflow: 'hidden', position: 'relative' }}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              pagingEnabled={true}
              decelerationRate={'fast'}
              scrollEventThrottle={16}
              onScroll={onScrollHandle}
              ref={banner}>
              {data &&
                data.length > 0 &&
                data.map((item, index) => {
                  return (
                    <View
                      style={{
                        width: screenWidth,
                        height: '100%',
                        justifyContent: 'center',
                        flexDirection: 'row',
                      }}
                      key={index}>
                      {item?.banner !== '' ? <Animated.Image
                        source={{ uri: item?.banner ? item.banner : 'cccc' }}
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderColor: 'black',
                          width: '100%',
                          height: '100%',
                          borderRadius: 4,
                        }}
                      /> : null}

                    </View>
                  );
                })}
            </ScrollView>
            <View style={styles.indicatorContainer}>
              {data &&
                data.length > 0 &&
                data.map((image, imageIndex) => {
                  const width = scrollX.interpolate({
                    inputRange: [
                      screenWidth * (imageIndex - 1),
                      screenWidth * imageIndex,
                      screenWidth * (imageIndex + 1),
                    ],
                    outputRange: [8, 16, 8],
                    extrapolate: 'clamp',
                  });
                  return <Animated.View key={imageIndex} style={[styles.normalDot, { width }]} />;
                })}
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
});

export default Banner;

const styles = StyleSheet.create({
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    position: 'absolute',
    top: 0,
    right: 10,
  },
  normalDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: 'silver',
    marginHorizontal: 4,
    color: 'white',
  },
});
