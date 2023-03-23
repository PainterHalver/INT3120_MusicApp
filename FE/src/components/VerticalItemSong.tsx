import React from 'react';
import {Image, View, Text} from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Svg, {Text as Stroke} from 'react-native-svg';

type Props = {
  thumbnail: string;
  artistsNames: string;
  title: string;
  chart?: boolean;
  pos?: number;
};

const VerticalItemSong = ({thumbnail, artistsNames, title, chart, pos}: Props) => {
  //console.log(pos);
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
          uri: thumbnail,
        }}
        style={styles.songThumbnail}
      />
      <View style={{width: '60%'}}>
        <Text style={{fontSize: 14, fontWeight: '400', color: '#ddd'}}>{title}</Text>
        <Text style={{fontSize: 12, fontWeight: '300', color: '#ddd'}}>{artistsNames}</Text>
      </View>
      <EntypoIcon name="dots-three-vertical" size={20} color="#ddd" />
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
