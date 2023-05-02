import {NavigationProp, useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {StyleSheet, TouchableNativeFeedback, View, ScrollView} from 'react-native';
import TrackPlayer, {Track} from 'react-native-track-player';

import {RootStackParamList} from '../../../App';
import {ZingMp3} from '../../ZingMp3';
import ItemSongResult from '../../components/ItemSongResult';
import {COLORS} from '../../constants';
import {useLoadingModal} from '../../contexts/LoadingModalContext';
import {Song, songsToTracks} from '../../types';
import Database from './../../Database';

interface Props {
  searchValue: string;
}

const SearchView = ({searchValue}: Props) => {
  const {setLoading} = useLoadingModal();

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [searchError, setSearchError] = React.useState<string | null>(null);
  const [searchResult, setSearchResult] = React.useState<Song[]>([]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleSearch();
    }, 200);

    return () => clearTimeout(timeout);
  }, [searchValue]);

  const handleSearch = async () => {
    try {
      const data = await ZingMp3.search(searchValue);
      setSearchResult(data.data.songs || []);
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        setSearchError(error.message);
      }
    }
  };

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

      const recommendedSongs = await ZingMp3.getRecommendSongs(song.encodeId);
      const newQueue = songsToTracks(recommendedSongs);
      newQueue.unshift(track);

      await TrackPlayer.reset();
      await TrackPlayer.add(newQueue);

      // Hiện player trước khi play
      navigation.navigate('Player');
      await TrackPlayer.play();

      // Lưu bài hát vào lịch sử tìm kiếm
      Database.saveSongSearchHistory(song);
    } catch (error) {
      console.log('PLAY SONG: ', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.resultContainer}>
        {searchError ||
          (searchResult.length > 0 &&
            searchResult.map((song, index) => {
              return (
                <TouchableNativeFeedback
                  key={song.encodeId}
                  background={TouchableNativeFeedback.Ripple(COLORS.RIPPLE_LIGHT, false)}
                  onPress={() => playSong(song)}>
                  <View style={{paddingVertical: 7}}>
                    <ItemSongResult song={song} />
                  </View>
                </TouchableNativeFeedback>
              );
            }))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  resultContainer: {
    paddingTop: 10,
  },
});

export default SearchView;
