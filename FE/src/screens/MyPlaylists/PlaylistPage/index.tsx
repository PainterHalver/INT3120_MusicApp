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
  const [songs, setSongs] = React.useState<Song[]>([]);

  useEffect(() => {
    (async () => {
      const songSnapshot = await firestore()
        .collection('playlists')
        .doc(playlist.id)
        .collection('songs')
        .get();
      setSongs(songSnapshot.docs.map(doc => doc.data() as Song));
    })();
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
      <StatusBar translucent barStyle={'dark-content'} backgroundColor={'transparent'} animated={true} />
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
          {songs.length < 1 ? (
            <ActivityIndicator size={'large'} color={COLORS.RED_PRIMARY} />
          ) : (
            songs.map((song, index) => {
              return (
                <TouchableNativeFeedback
                  key={song.encodeId}
                  background={TouchableNativeFeedback.Ripple(COLORS.RIPPLE_LIGHT, false)}
                  onPress={() => playSongInPlaylist(song, index)}>
                  <View>
                    <ItemSongResult song={song} />
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
