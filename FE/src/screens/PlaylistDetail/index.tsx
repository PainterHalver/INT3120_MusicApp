import React from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  ImageBackground,
  Platform,
  StatusBar,
  TouchableNativeFeedback,
} from 'react-native';
import axios from 'axios';
import {useState, useEffect} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import ItemAlbum from '../../components/ItemAlbum';
import ItemArtist from '../../components/ItemArtist';
import VerticalItemSong from '../../components/VerticalItemSong';
import {StackScreenProps} from '@react-navigation/stack';
import {CompositeScreenProps, useFocusEffect} from '@react-navigation/native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {BottomTabParamList, RootStackParamList} from '../../../App';
import {ZingMp3} from '../../ZingMp3';
import {Playlist, Song, songsToTracks} from '../../types';
import {useLoadingModal} from '../../contexts/LoadingModalContext';
import TrackPlayer, {Track} from 'react-native-track-player';

type Props = CompositeScreenProps<
  BottomTabScreenProps<BottomTabParamList, 'PlaylistDetail'>,
  StackScreenProps<RootStackParamList>
>;

const PlaylistDetail = ({navigation}: Props) => {
  const {setLoading} = useLoadingModal();
  const [playlist, setPlaylist] = useState<Playlist>();
  const [recommends, setRecommends] = useState();

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('light-content');
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
    }, []),
  );

  useEffect(() => {
    const getPlaylist = async () => {
      const playlist = await ZingMp3.getDetailPlaylist('69IAZIWU');
      //console.log(data.data.data.recommends);
      setPlaylist(playlist);
      // setRecommends((playlist as any).recommends.data[1].items);
    };
    getPlaylist();
  }, []);

  if (!playlist) {
    return <View />;
  }

  const playSongInPlaylist = async (track: Song, index: number) => {
    try {
      setLoading(true);
      const tracks = songsToTracks(playlist.song.items);

      await TrackPlayer.reset();

      // Thêm track cần play rồi thêm các track còn lại vào trước và sau track cần play
      await TrackPlayer.add(tracks[index]);
      await TrackPlayer.add(tracks.slice(0, index), 0);
      await TrackPlayer.add(tracks.slice(index + 1, tracks.length));

      navigation.navigate('Player');
      await TrackPlayer.play();
    } catch (error) {
      console.log('playSongInPlaylist:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={{uri: playlist.thumbnailM}}
      resizeMode="cover"
      onLoad={() => {
        // console.log('loaded player background image');
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
            height: '50%',
          }}>
          {playlist.song.items.map((song, index) => {
            return (
              <TouchableNativeFeedback
                key={index}
                onPress={() => {
                  playSongInPlaylist(song, index);
                }}>
                <View>
                  <VerticalItemSong song={song} />
                </View>
              </TouchableNativeFeedback>
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
          {/* {recommends && (
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
          )} */}
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
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
