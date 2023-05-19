import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  DeviceEventEmitter,
  Dimensions,
  ScrollView,
  Text,
  TouchableNativeFeedback,
  View,
  ActivityIndicator,
} from 'react-native';
import TrackPlayer, { Event, Track } from 'react-native-track-player';
import { addEventListener } from 'react-native-track-player/lib/trackPlayer';
import { COLORS, SIZES } from '../../../../constants';
import { defaultTrack, usePlayer } from '../../../../contexts/PlayerContext';
import { MemoizedTrackBottomSheet, TrackBottomSheet } from './TrackBottomSheet';
import { MemoizedTrackItem, TrackItem } from './TrackItem';
import { FlatList } from 'react-native-gesture-handler';

export const QueuePage = () => {
  const { currentTrack } = usePlayer();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedTrack, setSelectedTrack] = useState<Track>(defaultTrack);
  const trackBottomSheetRef = useRef<BottomSheetModal>(null);

  const getQueue = useCallback(async () => {
    const queueTracks = await TrackPlayer.getQueue();
    const index = await TrackPlayer.getActiveTrackIndex();
    setTracks(queueTracks);
    setCurrentIndex(index || 0);
  }, []);

  useEffect(() => {
    getQueue();
  }, []);

  useEffect(() => {
    console.log('QUEUE PAGE RENDERED');
  });

  useEffect(() => {
    const playerListener = addEventListener(Event.PlaybackActiveTrackChanged, getQueue);
    const deviceEventListener = DeviceEventEmitter.addListener('queue-updated', getQueue);

    return () => {
      playerListener.remove();
      deviceEventListener.remove();
    };
  }, []);

  const keyExtractor = useCallback((item: Track, index: number) => item.id, []);

  const renderItem = ({ item, index }: { item: Track; index: number }) => {
    return (
      <TouchableNativeFeedback
        background={TouchableNativeFeedback.Ripple(COLORS.RIPPLE_LIGHT, false)}
        onPress={() => {
          TrackPlayer.skip(index);
        }}>
        <View>
          <MemoizedTrackItem
            track={item}
            variant="text-light"
            playing={item.id === currentTrack.id}
            trackBottomSheetRef={trackBottomSheetRef}
            setSelectedTrack={setSelectedTrack}
          />
        </View>
      </TouchableNativeFeedback>
    );
  };

  return (
    <View style={{ width: SIZES.SCREEN_WIDTH, paddingVertical: 15, paddingHorizontal: 5 }}>
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
      <FlatList
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        data={tracks}
        keyExtractor={keyExtractor}
        ListEmptyComponent={<ActivityIndicator size="large" color={COLORS.RED_PRIMARY} />}
        renderItem={renderItem}
      />
      <MemoizedTrackBottomSheet
        selectedTrack={selectedTrack}
        ref={trackBottomSheetRef}
        tracks={tracks}
        setTracks={setTracks}
      />
    </View>
  );
};

export const MemoizedQueuePage = React.memo(QueuePage);
