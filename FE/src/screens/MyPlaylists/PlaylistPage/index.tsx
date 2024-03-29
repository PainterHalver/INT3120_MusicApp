// @refresh reset

import {StackScreenProps} from '@react-navigation/stack';
import React, {useEffect} from 'react';
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
} from 'react-native';
import {Shadow} from 'react-native-shadow-2';
import OctIcon from 'react-native-vector-icons/Octicons';
import {MyPlaylistsStackParamList} from '..';
import {COLORS} from '../../../constants';
import {useAuth} from '../../../contexts/AuthContext';
import {Song, songsToTracks} from '../../../types';
import ItemSongResult from '../../../components/ItemSongResult';
import {useLoadingModal} from '../../../contexts/LoadingModalContext';
import {ZingMp3} from '../../../ZingMp3';
import TrackPlayer, {Track} from 'react-native-track-player';
import firestore from '@react-native-firebase/firestore';
import {CompositeScreenProps} from '@react-navigation/native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {BottomTabParamList, RootStackParamList} from '../../../../App';
import Clipboard from '@react-native-clipboard/clipboard';
import {ShareIcon} from '../../../icons/ShareIcon';
import FocusAwareStatusBar from '../../../components/FocusAwareStatusBar';

type Props = CompositeScreenProps<
  CompositeScreenProps<
    StackScreenProps<MyPlaylistsStackParamList, 'PlaylistPage'>,
    BottomTabScreenProps<BottomTabParamList, 'Test'>
  >,
  StackScreenProps<RootStackParamList>
>;

const PlaylistPage: React.FC<Props> = ({navigation, route}) => {
  const {playlist} = route.params;
  const {setLoading} = useLoadingModal();
  const [loadingSongs, setLoadingSongs] = React.useState<boolean>(true);
  const [songs, setSongs] = React.useState<Song[]>([]);

  useEffect(() => {
    const subscriber = firestore()
      .collection('playlists')
      .doc(playlist.id)
      .collection('songs')
      .onSnapshot(snapshot => {
        setSongs(snapshot.docs.map(doc => doc.data() as Song));
        setLoadingSongs(false);
      });

    return () => subscriber();

    // (async () => {
    //   try {
    //     const songSnapshot = await firestore()
    //       .collection('playlists')
    //       .doc(playlist.id)
    //       .collection('songs')
    //       .get();
    //     setSongs(songSnapshot.docs.map(doc => doc.data() as Song));
    //   } catch (error) {
    //     console.log('PlaylistPage:', error);
    //     ToastAndroid.show('Có lỗi khi tải danh sách bài hát', ToastAndroid.SHORT);
    //   } finally {
    //     setLoadingSongs(false);
    //   }
    // })();
  }, []);

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
                  navigation.goBack();
                }}>
                <OctIcon name="arrow-left" size={28} color={COLORS.TEXT_PRIMARY} />
              </TouchableOpacity>
            </View>
            <Text style={{color: COLORS.TEXT_PRIMARY, fontSize: 25, fontWeight: '600'}}>Playlist</Text>
            <View style={{position: 'absolute', right: 5, bottom: 5}}>
              <TouchableOpacity
                onPress={() => {
                  Clipboard.setString(`http://mobile3year.com/sharedplaylist/${playlist.id}`);
                  ToastAndroid.show(
                    `Đã copy http://mobile3year.com/sharedplaylist/${playlist.id}`,
                    ToastAndroid.SHORT,
                  );
                }}>
                <View>
                  <ShareIcon size={25} color={COLORS.TEXT_PRIMARY} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Shadow>
        <View style={{flex: 1, paddingVertical: 15}}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: COLORS.TEXT_PRIMARY,
              paddingBottom: 7,
              paddingHorizontal: 15,
            }}>
            {playlist.name}
          </Text>
          {loadingSongs ? (
            <ActivityIndicator size={'large'} color={COLORS.RED_PRIMARY} />
          ) : songs.length === 0 ? (
            <View style={{paddingHorizontal: 15}}>
              <Text style={{color: COLORS.TEXT_PRIMARY, fontSize: 15}}>Không có bài hát nào</Text>
            </View>
          ) : (
            songs.map((song, index) => {
              return (
                <TouchableNativeFeedback
                  key={song.encodeId}
                  background={TouchableNativeFeedback.Ripple(COLORS.RIPPLE_LIGHT, false)}
                  onPress={() => {
                    playSongInPlaylist(song, index);
                  }}>
                  <View style={{paddingVertical: 7}}>
                    <ItemSongResult song={song} ownerId={playlist.uid} />
                  </View>
                </TouchableNativeFeedback>
              );
            })
          )}
        </View>
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

export default PlaylistPage;
