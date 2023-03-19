import React from 'react';
import {Text, View, Image} from 'react-native';
import axios from 'axios';
import {useState, useEffect} from 'react';
import {LogBox} from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
//type Props = StackScreenProps<RootStackParamList, 'PlaylistDetail'>;

const PlaylistDetail = () => {
  const [playlist, setPlaylist] = useState();
  useEffect(() => {
    const getPlaylist = async () => {
      const data = await axios.get('http://10.0.2.2:5000/playlist', {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      console.log(data.data.data.data.thumbnail);
      setPlaylist(data.data.data.data);
    };
    getPlaylist();
  }, []);
  return (
    <View
      style={{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: '100%',
      }}>
      <View
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '30%',
        }}>
        {playlist != null && (
          <Image
            source={{
              uri: playlist.thumbnail,
            }}
            style={{
              height: '60%',
              aspectRatio: 1,
              borderRadius: 15,
            }}
          />
        )}
        <Text
          style={{
            textAlign: 'center',
            fontSize: 20,
            fontWeight: '700',
          }}>
          {playlist?.title}
        </Text>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 16,
            fontWeight: '400',
          }}>
          {playlist?.artistsNames}
        </Text>
      </View>
      <View
        style={{
          marginHorizontal: '5%',
        }}>
        {playlist?.song.items.map((element, index) => {
          return (
            <View
              key={index}
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
                  uri: element?.thumbnail,
                }}
                style={{
                  height: '80%',
                  aspectRatio: 1,
                  borderRadius: 15,
                }}
              />
              <View style={{width: '60%'}}>
                <Text>{element.title}</Text>
                <Text>{element.artistsNames}</Text>
              </View>
              <EntypoIcon name="dots-three-vertical" size={20} color="#ddd" />
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default PlaylistDetail;
