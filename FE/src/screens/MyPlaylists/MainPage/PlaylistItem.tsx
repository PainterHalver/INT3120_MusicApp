import {StyleSheet, Text, View, Image, TouchableNativeFeedback} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import React, {memo, useEffect} from 'react';
import {COLORS} from '../../../constants';
import {MyPlaylist} from '../../../types';
import {BottomSheetModal} from '@gorhom/bottom-sheet';

interface Props {
  playlist: MyPlaylist;
  playlistBottomSheetRef: React.RefObject<BottomSheetModal>;
  setSelectedPlaylist: React.Dispatch<React.SetStateAction<MyPlaylist>>;
}

export const PlaylistItem = ({playlist, playlistBottomSheetRef, setSelectedPlaylist}: Props) => {
  return (
    <View
      style={{
        paddingHorizontal: 15,
        paddingVertical: 7,
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
      }}>
      <Image
        source={require('../../../../assets/default_song_thumbnail.png')}
        style={{width: 45, height: 45, borderRadius: 7}}
      />
      <View style={{marginRight: 'auto'}}>
        <Text style={{color: COLORS.TEXT_PRIMARY, fontSize: 16}}>{playlist.name}</Text>
      </View>
      <TouchableNativeFeedback
        hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
        background={TouchableNativeFeedback.Ripple(COLORS.RIPPLE_LIGHT, true, 30)}
        onPress={() => {
          setSelectedPlaylist(playlist);
          playlistBottomSheetRef.current?.present();
        }}>
        <View>
          <IonIcon name="ios-ellipsis-vertical" size={20} color={COLORS.TEXT_GRAY} />
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};

export const MemoizedPlaylistItem = memo(PlaylistItem, (prevProps, nextProps) => {
  return prevProps.playlist.name === nextProps.playlist.name;
});

const styles = StyleSheet.create({});
