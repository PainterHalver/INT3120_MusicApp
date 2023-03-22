import React from 'react';
import {Text, View, Image, StyleSheet, ImageBackground} from 'react-native';
import axios from 'axios';
import {useState, useEffect} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import ItemAlbum from '../../componentss/ItemAlbum';
import ItemArtist from '../../componentss/ItemArtist';
import VerticalItemSong from '../../componentss/VerticalItemSong';
//type Props = StackScreenProps<RootStackParamList, 'PlaylistDetail'>;

const PlaylistDetail = () => {
  const [playlist, setPlaylist] = useState();
  const [recommends, setRecommends] = useState();
  useEffect(() => {
    const getPlaylist = async () => {
      const data = await axios.get('http://10.0.2.2:5000/playlist', {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      //console.log(data.data.data.recommends);
      setPlaylist(data.data.data.detail.data);
      setRecommends(data.data.data.recommends.data[1].items);
    };
    getPlaylist();
  }, []);

  if (playlist) {
    return (
      <ImageBackground
        source={{uri: playlist.thumbnailM}}
        resizeMode="cover"
        onLoad={() => {
          console.log('loaded player background image');
        }}
        style={{width: '100%', height: '100%'}}
        blurRadius={4}>
        <View style={styles.wrapper}>
          <View style={styles.playlistInfo}>
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
            <Text style={styles.title}>{playlist?.title}</Text>
            <Text style={styles.normText}>{playlist?.artistsNames}</Text>
          </View>
          <ScrollView
            style={{
              marginHorizontal: '5%',
              height: '50%',
            }}>
            {playlist?.song.items.map((element, index) => {
              return (
                <VerticalItemSong
                  key={index}
                  thumbnail={element.thumbnail}
                  title={element.title}
                  artistsNames={element.artistsNames}
                />
              );
            })}
            {playlist && (
              <View
                style={{
                  marginTop: '8%',
                }}>
                <Text style={styles.partText}>Artists</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {playlist.artists.map((element, index) => {
                    return (
                      <ItemArtist
                        key={index}
                        description={element.name}
                        image={element.thumbnail}
                        size={130}
                      />
                    );
                  })}
                </ScrollView>
              </View>
            )}
            {recommends && (
              <View
                style={{
                  marginTop: '8%',
                }}>
                <Text style={styles.partText}>Relating</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {recommends.map((element, index) => {
                    return (
                      <ItemAlbum
                        key={index}
                        description={element.title}
                        image={element.thumbnail}
                        size={130}
                      />
                    );
                  })}
                </ScrollView>
              </View>
            )}
          </ScrollView>
        </View>
      </ImageBackground>
    );
  }
};

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: '100%',
  },
  playlistInfo: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '30%',
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: '#ddd',
  },
  normText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '400',
    color: '#ddd',
  },
  partText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#ddd',
  },
  songContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: '2%',
    justifyContent: 'space-evenly',
    paddingVertical: '2%',
    height: 80,
  },
});

export default PlaylistDetail;
