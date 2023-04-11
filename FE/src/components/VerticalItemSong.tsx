import React from 'react';
import {Image, Text, TouchableNativeFeedback, View} from 'react-native';
import Svg, {Text as Stroke} from 'react-native-svg';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import {usePlayer} from '../contexts/PlayerContext';
import {Song} from '../types';

type Props = {
  song: Song;
  chart?: boolean;
  pos?: number;
};

const VerticalItemSong = ({song, chart, pos}: Props) => {
  const {setSelectedSong, songBottomSheetRef} = usePlayer();

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: '2%',
        justifyContent: 'space-evenly',
        paddingVertical: '2%',
        height: 80,
      }}>
      {chart && (
        <Svg height="100%" width="38">
          <Stroke
            fill="none"
            stroke={
              pos == 0
                ? 'rgba(74, 144, 226, 1)'
                : pos == 1
                ? 'rgba(80, 227, 194, 1)'
                : pos == 2
                ? 'rgba(227, 80, 80, 1)'
                : 'white'
            }
            fontSize="20"
            fontWeight="bold"
            x="20"
            y="38"
            textAnchor="middle">
            {pos + 1}
          </Stroke>
        </Svg>
      )}
      <Image
        source={{
          uri: song.thumbnail,
        }}
        style={styles.songThumbnail}
      />
      <View style={{width: '60%'}}>
        <Text style={{fontSize: 14, fontWeight: '400', color: '#ddd'}}>{song.title}</Text>
        <Text style={{fontSize: 12, fontWeight: '300', color: '#ddd'}}>{song.artistsNames}</Text>
      </View>
      <TouchableNativeFeedback
        hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
        onPress={() => {
          setSelectedSong(song);
          songBottomSheetRef.current?.present();
        }}>
        <EntypoIcon name="dots-three-vertical" size={20} color="#ddd" />
      </TouchableNativeFeedback>
    </View>
  );
};

const styles = {
  songThumbnail: {
    height: '80%',
    aspectRatio: 1,
    borderRadius: 15,
  },
};

export default VerticalItemSong;
