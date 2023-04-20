import {View, Text} from 'react-native';
import TrackPlayer, {useProgress} from 'react-native-track-player';
import Slider from '@react-native-community/slider';
import {useEffect, useState} from 'react';
import {usePlayer} from '../../contexts/PlayerContext';

const formatTime = (seconds: any) => {
  if (seconds === null) {
    return '--:--';
  }

  seconds = seconds.toFixed();

  const second = (Math.floor(seconds % 60) < 10 ? '0' : '') + Math.floor(seconds % 60);

  let minutes: number = Math.floor(seconds / 60);

  let hours: number | string = '00';

  if (minutes < 10) {
    // @ts-ignore
    minutes = '0' + minutes;
  }

  if (minutes >= 60) {
    hours = Math.floor(minutes / 60);
    minutes = minutes % 60;

    if (minutes < 10) {
      // @ts-ignore
      minutes = '0' + minutes;
    }
  }

  return `${hours !== '00' ? hours + ':' : ''}${minutes}:${second}`;
};

export const SliderAndProgress = () => {
  const progress = useProgress(250);
  const [sliderValue, setSliderValue] = useState<number>(0);
  const [slidingSlider, setSlidingSlider] = useState<boolean>(false);

  useEffect(() => {
    if (!slidingSlider) {
      setSliderValue(progress.position);
    }
  }, [progress]);

  return (
    <View>
      <View style={{marginHorizontal: -15}}>
        <Slider
          style={{
            height: 40,
            width: '100%',
          }}
          minimumValue={0}
          maximumValue={progress.duration}
          step={0.1}
          value={sliderValue}
          thumbTintColor="#fff"
          minimumTrackTintColor="#fff"
          maximumTrackTintColor="#ffffff"
          onSlidingComplete={async value => {
            setSlidingSlider(false);
            await TrackPlayer.seekTo(value + 1);
          }}
          onValueChange={value => {
            setSliderValue(value);
          }}
          onSlidingStart={() => setSlidingSlider(true)}
        />
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={{color: '#ffffffcc'}}>{formatTime(sliderValue)}</Text>
        <Text style={{color: '#ffffffcc'}}>{formatTime(progress.duration - sliderValue)}</Text>
      </View>
    </View>
  );
};
