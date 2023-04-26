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
  SafeAreaView,
} from 'react-native';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import ItemAlbum from '../../components/ItemAlbum';
import ItemArtist from '../../components/ItemArtist';
import VerticalItemSong from '../../components/VerticalItemSong';
import { StackScreenProps } from '@react-navigation/stack';
import { CompositeScreenProps, useFocusEffect } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { BottomTabParamList, RootStackParamList } from '../../../App';
import { ZingMp3 } from '../../ZingMp3';
import { Playlist, Song, songsToTracks } from '../../types';
import { useLoadingModal } from '../../contexts/LoadingModalContext';
import TrackPlayer, { Track } from 'react-native-track-player';
import LinearGradient from 'react-native-linear-gradient';
import ItemSongResult from '../../components/ItemSongResult';
import { COLORS } from '../../constants';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { DownloadIcon } from '../../icons/DownloadIcon';
import { HeartIcon } from '../../icons/HeartIcon';

type Props = CompositeScreenProps<
  BottomTabScreenProps<BottomTabParamList, 'PlaylistDetail'>,
  StackScreenProps<RootStackParamList>
>;

const PlaylistDetail = ({ navigation }: Props) => {
  const { setLoading } = useLoadingModal();
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
    <SafeAreaView>
      <ScrollView style={{}}>
        <View style={styles.wrapper}>
          <ImageBackground
            source={{ uri: playlist.thumbnailM }}
            resizeMode="cover"
            onLoad={() => {
              // console.log('loaded player background image');
            }}
            style={{ width: '100%', display: 'flex', flexDirection: 'column' }}
            blurRadius={60}>
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 0.6 }}
              colors={['#FFFFFF00', '#FFFFFF']}
              style={{
                paddingHorizontal: 10,
                paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
              }}>
              <StatusBar
                barStyle={'light-content'}
                translucent
                backgroundColor={'transparent'}
                animated={true}
              />
              <View>
                <Text style={{ color: 'white', paddingVertical: 10 }}>
                  <AntIcon size={20} name="arrowleft" color={COLORS.TEXT_WHITE_PRIMARY} />
                </Text>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  width: '100%',
                  alignItems: 'center',
                }}>
                <Image
                  source={{
                    uri: playlist.thumbnail,
                  }}
                  style={{
                    height: 235,
                    width: 235,
                    aspectRatio: 1,
                    borderRadius: 10,
                  }}
                />
                <Text style={styles.title}>{playlist?.title}</Text>
                <Text style={styles.normText}>{playlist?.artistsNames}</Text>
                <Text>{playlist?.song.total + ' bài hát • ' + playlist?.song.totalDuration}</Text>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: 20,
                    alignItems: 'center',
                    marginVertical: 20,
                  }}>
                  <TouchableNativeFeedback
                    onPress={() => {
                      // downloadSong(selectedSong);
                      // ((ref as any).current as any).close();
                    }}>
                    <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <DownloadIcon size={25} color={COLORS.TEXT_PRIMARY} />
                      <Text style={styles.optionText}>Tải xuống</Text>
                    </View>
                  </TouchableNativeFeedback>
                  <TouchableNativeFeedback
                    style={{ borderRadius: 30 }}
                    onPress={() => {
                      // downloadSong(selectedSong);
                      // ((ref as any).current as any).close();
                    }}>
                    <View
                      style={{
                        display: 'flex',
                        borderRadius: 30,
                        backgroundColor: COLORS.PURPLE_ZING,
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '60%',
                        paddingVertical: 10,
                      }}>
                      <Text
                        style={{
                          fontSize: 18,
                          color: 'white',
                          fontWeight: 'bold',
                        }}>
                        Phát ngẫu nhiên
                      </Text>
                    </View>
                  </TouchableNativeFeedback>
                  <TouchableNativeFeedback
                    onPress={() => {
                      // downloadSong(selectedSong);
                      // ((ref as any).current as any).close();
                    }}>
                    <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <HeartIcon size={25} color={COLORS.TEXT_PRIMARY} />
                      <Text style={styles.optionText}>Thích</Text>
                    </View>
                  </TouchableNativeFeedback>
                </View>
                <Text style={{ color: COLORS.TEXT_PRIMARY, fontSize: 13, paddingBottom: 20 }}>
                  {playlist?.sortDescription}
                </Text>
              </View>
            </LinearGradient>
          </ImageBackground>

          {playlist.song.items.map((song, index) => {
            return (
              <TouchableNativeFeedback
                key={index}
                onPress={() => {
                  playSongInPlaylist(song, index);
                }}>
                <View style={{ width: '100%', paddingVertical: 7 }}>
                  {/* <VerticalItemSong song={song} /> */}
                  <ItemSongResult song={song} />
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    backgroundColor: 'transparent',
    // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  title: {
    paddingTop: 20,
    paddingBottom: 10,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.TEXT_PRIMARY,
  },
  normText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '400',
    color: COLORS.TEXT_GRAY,
  },
  partText: {
    fontSize: 16,
    fontWeight: '400',
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
  optionText: {
    fontSize: 14.5,
    color: COLORS.TEXT_PRIMARY,
  },
});

export default PlaylistDetail;
