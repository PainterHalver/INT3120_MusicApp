import React from 'react';
import {Image, View, Text} from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';

type Props = {
  thumbnail: string;
  artistsNames: string;
  title: string;
};

const VerticalItemSong = ({thumbnail, artistsNames, title}: Props) => {
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
      <Image
        source={{
          uri: thumbnail,
        }}
        style={styles.songThumbnail}
      />
      <View style={{width: '60%'}}>
        <Text style={{fontSize: 14, fontWeight: '400', color: '#ddd'}}>
          {title}
        </Text>
        <Text style={{fontSize: 12, fontWeight: '300', color: '#ddd'}}>
          {artistsNames}
        </Text>
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
