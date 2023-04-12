import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native';
import TrackPlayer, { Track } from 'react-native-track-player';
import { RootStackParamList } from '../../../App';
import { ZingMp3 } from '../../ZingMp3';
import ItemSongResult from '../../components/ItemSongResult';
import { COLORS } from '../../constants';
import { useLoadingModal } from '../../contexts/LoadingModalContext';
import { Song } from '../../types';
import Database from './../../Database';

interface Props {}

const HistoryView = ({}: Props) => {
  const {setLoading} = useLoadingModal();
  const [historySongs, setHistorySongs] = React.useState<Song[]>([]);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    (async () => {
      const songs = await Database.getTopSongSearchHistory(10);
      setHistorySongs(songs);
    })();
  }, []);

  const playSong = async (song: Song) => {
    try {
      setLoading(true);
      const data = await ZingMp3.getSong(song.encodeId);
      const track: Track = {
        id: song.encodeId,
        url: data.data['128'],
        title: song.title,
        artist: song.artistsNames,
        artwork: song.thumbnailM,
      };

      setLoading(false);
      await TrackPlayer.load(track);

      // Hiện player trước khi play
      navigation.navigate('Player');
      await TrackPlayer.play();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.historyContainer}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '600',
            color: COLORS.TEXT_PRIMARY,
            paddingBottom: 7,
            paddingHorizontal: 15,
          }}>
          Tìm kiếm gần đây
        </Text>
        {historySongs.length > 0 &&
          historySongs.map((song, index) => {
            return (
              <TouchableNativeFeedback
                key={song.encodeId}
                background={TouchableNativeFeedback.Ripple(COLORS.RIPPLE_LIGHT, false)}
                onPress={() => playSong(song)}>
                <View>
                  <ItemSongResult song={song} />
                </View>
              </TouchableNativeFeedback>
            );
          })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  historyContainer: {
    paddingVertical: 15,
  },
});

export default HistoryView;
