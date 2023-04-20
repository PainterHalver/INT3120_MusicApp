import { View, Text } from 'react-native';
import TrackPlayer, { useProgress } from 'react-native-track-player';
import Slider from '@react-native-community/slider';
import { useEffect, useState } from 'react';
import { usePlayer } from '../../contexts/PlayerContext';

export const SliderAndProgress = () => {
  const { setProgress } = usePlayer();
  const progress = useProgress(250);
  const [sliderValue, setSliderValue] = useState<number>(0);
  const [slidingSlider, setSlidingSlider] = useState<boolean>(false);
  console.log(progress)
  useEffect(() => {
    if (!slidingSlider) {
      setSliderValue(progress.position);
    }
    setProgress(progress)
  }, [progress]);

  return (
    <View>
      <View style={{ marginHorizontal: -15 }}>
        <Slider
          style={{
            height: 40,
            width: '100%',
          }}
          minimumValue={0}
          maximumValue={progress.duration}
          value={sliderValue}
          thumbTintColor="#fff"
          minimumTrackTintColor="#fff"
          maximumTrackTintColor="#ffffff"
          onSlidingComplete={async value => {
            setSlidingSlider(false);
            await TrackPlayer.seekTo(value + 1); // +1 để để khớp với progress (đừng hỏi tại sao)
          }}
          onValueChange={value => {
            setSliderValue(value);
          }}
          onSlidingStart={() => setSlidingSlider(true)}
        />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ color: '#ffffffcc' }}>
          {Math.floor(sliderValue / 60)
            .toString()
            .padStart(2, '0') +
            ':' +
            Math.floor(sliderValue % 60)
              .toString()
              .padStart(2, '0')}
        </Text>
        <Text style={{ color: '#ffffffcc' }}>
          {Math.floor((progress.duration - sliderValue + 1) / 60)
            .toString()
            .padStart(2, '0') +
            ':' +
            Math.floor((progress.duration - sliderValue + 1) % 60)
              .toString()
              .padStart(2, '0')}
        </Text>
      </View>
    </View>
  );
};
