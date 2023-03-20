import {
  View,
  Image,
  ScrollView,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
type Props = {
  data: Array<{image: string}>;
};
const Banner = ({data}: Props): JSX.Element => {
  const [indexOffset, setIndexOffset] = useState(0);
  const screenWidth = Dimensions.get('window').width - 20;
  const banner = useRef<ScrollView>(null);

  const onScrollHandle = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!e) {
      return null;
    }
    const nativeEvent = e.nativeEvent;
    const currentOffset = nativeEvent.contentOffset.x;
    console.log(currentOffset);
    let imageIndex = 0;
    if (nativeEvent.contentOffset.x > 0) {
      imageIndex = Math.floor(
        (nativeEvent.contentOffset.x + screenWidth / 2) / screenWidth,
      );
    }
    setIndexOffset(imageIndex);
  };

  useEffect(() => {
    let i = 0;
    setInterval(() => {
      if (banner !== null && banner.current !== null) {
        banner.current.scrollTo({
          x: i * screenWidth,
          y: 0,
          animated: true,
        });
        i += 1;
        if (i > data.length) {
          i = 0;
        }
      }
    }, 3000);
  }, [data]);

  return (
    <View>
      <ScrollView
        style={{height: 200, overflow: 'hidden'}}
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
                <Image
                  source={{uri: item.image}}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderColor: 'black',
                    width: '100%',
                    height: '100%',
                  }}
                />
              </View>
            );
          })}
      </ScrollView>
      <Text>index: {indexOffset}</Text>
    </View>
  );
};

export default Banner;
