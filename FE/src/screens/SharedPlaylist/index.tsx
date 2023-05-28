// @refresh reset

import {StackScreenProps} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableNativeFeedback,
  TouchableOpacity,
  ToastAndroid,
  Image,
  ImageBackground,
} from 'react-native';
import {Shadow} from 'react-native-shadow-2';
import OctIcon from 'react-native-vector-icons/Octicons';
import {MyPlaylistsStackParamList} from '../MyPlaylists';
import {COLORS} from '../../constants';
import {useAuth} from '../../contexts/AuthContext';
import {Song, songsToTracks} from '../../types';
import ItemSongResult from '../../components/ItemSongResult';
import {useLoadingModal} from '../../contexts/LoadingModalContext';
import {ZingMp3} from '../../ZingMp3';
import TrackPlayer, {Track} from 'react-native-track-player';
import firestore from '@react-native-firebase/firestore';
import {CompositeScreenProps} from '@react-navigation/native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {BottomTabParamList, RootStackParamList} from '../../../App';
import {ScrollView} from 'react-native-gesture-handler';
import VerticalItemSong from '../../components/VerticalItemSong';
import LinearGradient from 'react-native-linear-gradient';
import FocusAwareStatusBar from '../../components/FocusAwareStatusBar';

type Props = CompositeScreenProps<
  CompositeScreenProps<
    StackScreenProps<MyPlaylistsStackParamList, 'SharedPlaylist'>,
    BottomTabScreenProps<BottomTabParamList, 'Test'>
  >,
  StackScreenProps<RootStackParamList>
>;

const SharedPlaylist = ({navigation, route}: Props) => {
  const [detail, setDetail] = useState({});
  const {setLoading} = useLoadingModal();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loadingSongs, setLoadingSongs] = useState<boolean>(true);
  const {user} = useAuth();
  useEffect(() => {
    const addSelectedSongToPlaylist = async () => {
      try {
        const subscriber1 = await firestore()
          .collection('playlists')
          .doc(route.params.id)
          .onSnapshot(snapshot => {
            setDetail(snapshot);
          });

        const subscriber2 = await firestore()
          .collection('playlists')
          .doc(route.params.id)
          .collection('songs')
          .onSnapshot(snapshot => {
            setSongs(snapshot.docs.map(doc => doc.data() as Song));
          });
        setLoadingSongs(false);
        return () => {
          subscriber1();
          subscriber2();
        };
      } catch (error) {
        console.log(error);
        ToastAndroid.show('Có lỗi khi hiển thị playlist', ToastAndroid.SHORT);
      }
    };
    addSelectedSongToPlaylist();
  }, [route.params.id]);

  const playSongInPlaylist = async (track: Song, index: number) => {
    try {
      setLoading(true);
      const tracks = songsToTracks(songs);

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
    <View style={styles.containerWrapper}>
      <FocusAwareStatusBar translucent barStyle={'dark-content'} backgroundColor={'transparent'} />
      <View style={styles.container}>
        <Shadow
          sides={{bottom: true, top: false, end: false, start: false}}
          style={styles.headerContainer}
          stretch
          distance={2.5}>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              padding: 5,
              gap: 10,
              justifyContent: 'center',
              position: 'relative',
            }}>
            <View style={{position: 'absolute', left: 5, bottom: 5}}>
              <TouchableOpacity
                hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
                onPress={() => {
                  if (navigation.canGoBack()) {
                    navigation.goBack();
                  } else {
                    navigation.navigate('Home');
                  }
                }}>
                <OctIcon name="arrow-left" size={28} color={COLORS.TEXT_PRIMARY} />
              </TouchableOpacity>
            </View>
            <Text style={{color: COLORS.TEXT_PRIMARY, fontSize: 20, fontWeight: '600'}}>
              {`Chia sẻ bởi ${detail?._data?.owner}`}
            </Text>
            {user && user.uid !== detail?._data?.uid && !detail?._data?.sharedTo.includes(user.uid) && (
              <View style={{position: 'absolute', right: 5, bottom: 5}}>
                <TouchableOpacity
                  hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
                  onPress={async () => {
                    await firestore()
                      .collection('playlists')
                      .doc(route.params.id)
                      .update({sharedTo: [...detail._data.sharedTo, user.uid]});
                    ToastAndroid.show('Đã thêm vào danh sách playlist', ToastAndroid.SHORT);
                  }}>
                  <OctIcon name="diff-added" size={28} color={COLORS.TEXT_PRIMARY} />
                </TouchableOpacity>
              </View>
            )}
            {user && user.uid !== detail?._data?.uid && detail?._data?.sharedTo.includes(user.uid) && (
              <View style={{position: 'absolute', right: 5, bottom: 5}}>
                <TouchableOpacity
                  hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
                  onPress={async () => {
                    await firestore()
                      .collection('playlists')
                      .doc(route.params.id)
                      .update({
                        sharedTo: detail._data.sharedTo.filter(element => {
                          element !== user.uid;
                        }),
                      });
                    ToastAndroid.show('Đã loại bỏ khỏi danh sách playlist', ToastAndroid.SHORT);
                  }}>
                  <OctIcon name="check-circle" size={28} color={COLORS.TEXT_PRIMARY} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </Shadow>
        {songs.length > 0 && (
          <View style={{flex: 1}}>
            <View>
              <ImageBackground
                source={{uri: songs[0]?.thumbnailM}}
                resizeMode="cover"
                onLoad={() => {
                  // console.log('loaded player background image');
                }}
                style={{width: '100%', display: 'flex', flexDirection: 'column'}}
                blurRadius={60}>
                <LinearGradient
                  start={{x: 0, y: 0}}
                  end={{x: 0, y: 1}}
                  colors={['#FFFFFF00', '#FFFFFF']}
                  style={{
                    paddingHorizontal: 10,
                    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
                  }}>
                  <Image
                    source={{uri: songs[0]?.thumbnailM}}
                    style={{width: 150, height: 150, borderRadius: 10, alignSelf: 'center'}}
                  />

                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '600',
                      color: COLORS.TEXT_PRIMARY,
                      paddingVertical: 8,
                      paddingHorizontal: 15,
                      textAlign: 'center',
                    }}>
                    {detail?._data?.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '600',
                      color: COLORS.TEXT_PRIMARY,
                      paddingVertical: 8,
                      paddingHorizontal: 15,
                      textAlign: 'center',
                    }}>
                    {`${songs?.length} bài hát`}
                  </Text>
                </LinearGradient>
              </ImageBackground>
            </View>
            {loadingSongs ? (
              <ActivityIndicator size={'large'} color={COLORS.RED_PRIMARY} />
            ) : songs.length === 0 ? (
              <View style={{paddingHorizontal: 15}}>
                <Text style={{color: COLORS.TEXT_PRIMARY, fontSize: 15}}>Không có bài hát nào</Text>
              </View>
            ) : (
              <ScrollView>
                {songs.map((song, index) => {
                  return (
                    <TouchableNativeFeedback
                      key={song.encodeId}
                      background={TouchableNativeFeedback.Ripple(COLORS.RIPPLE_LIGHT, false)}
                      onPress={() => playSongInPlaylist(song, index)}>
                      <View>
                        <VerticalItemSong song={song} />
                      </View>
                    </TouchableNativeFeedback>
                  );
                })}
              </ScrollView>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerWrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },
});

export default SharedPlaylist;
