import {BottomSheetModal} from '@gorhom/bottom-sheet';
import React, {useEffect, useRef, useState} from 'react';
import {
  DeviceEventEmitter,
  Dimensions,
  ScrollView,
  Text,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import TrackPlayer, {Event, Track} from 'react-native-track-player';
import {addEventListener} from 'react-native-track-player/lib/trackPlayer';
import {COLORS, SIZES} from '../../../../constants';
import {defaultTrack} from '../../../../contexts/PlayerContext';
import {TrackBottomSheet} from './TrackBottomSheet';
import {TrackItem} from './TrackItem';

export const QueuePage = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedTrack, setSelectedTrack] = useState<Track>(defaultTrack);
  const trackBottomSheetRef = useRef<BottomSheetModal>(null);

  const getQueue = async () => {
    const tracks = await TrackPlayer.getQueue();
    const index = await TrackPlayer.getActiveTrackIndex();
    setTracks(tracks);
    setCurrentIndex(index || 0);
  };

  useEffect(() => {
    getQueue();
  }, []);

  useEffect(() => {
    const playerListener = addEventListener(Event.PlaybackActiveTrackChanged, getQueue);
    const deviceEventListener = DeviceEventEmitter.addListener('queue-updated', getQueue);

    return () => {
      playerListener.remove();
      deviceEventListener.remove();
    };
  }, []);

  return (
    <View style={{width: SIZES.SCREEN_WIDTH, paddingVertical: 15, paddingHorizontal: 5}}>
      <Text
        style={{
          fontSize: 16,
          fontWeight: '600',
          color: COLORS.TEXT_WHITE_PRIMARY,
          paddingBottom: 7,
          paddingHorizontal: 15,
        }}>
        Danh sách phát
      </Text>
      <ScrollView contentContainerStyle={{paddingBottom: 20}} showsVerticalScrollIndicator={false}>
        {tracks.map((track, index) => {
          return (
            <TouchableNativeFeedback
              key={index}
              background={TouchableNativeFeedback.Ripple(COLORS.RIPPLE_LIGHT, false)}
              onPress={() => {
                TrackPlayer.skip(index);
              }}>
              <View>
                <TrackItem
                  track={track}
                  variant="text-light"
                  playing={index === currentIndex}
                  trackBottomSheetRef={trackBottomSheetRef}
                  setSelectedTrack={setSelectedTrack}
                />
              </View>
            </TouchableNativeFeedback>
          );
        })}
      </ScrollView>
      <TrackBottomSheet
        selectedTrack={selectedTrack}
        ref={trackBottomSheetRef}
        tracks={tracks}
        setTracks={setTracks}
      />
    </View>
  );
};
