import {Text, View, StyleSheet, Image, TouchableNativeFeedback} from 'react-native';
import React, {useEffect} from 'react';
import TrackPlayer, {Track} from 'react-native-track-player';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import IonIcon from 'react-native-vector-icons/Ionicons';

import {API_URL} from '../../constants';
import {COLORS} from '../../constants';
import {RootStackParamList} from '../../../App';

interface Props {
  searchValue: string;
}

// const data = [
//   {
//     title: 'Bài hát 1',
//     artistsNames: 'Nghệ sĩ 1, Nghệ sĩ 2',
//     thumbnail:
//       'https://photo-resize-zmp3.zmdcdn.me/w94_r1x1_jpeg/cover/5/b/5/7/5b57e6c61848cfed2fa19cd31b293898.jpg',
//   },
//   {
//     title: 'Bài hát 2',
//     artistsNames: 'Nghệ sĩ 1, Nghệ sĩ 2',
//     thumbnail:
//       'https://photo-resize-zmp3.zmdcdn.me/w94_r1x1_jpeg/cover/5/b/5/7/5b57e6c61848cfed2fa19cd31b293898.jpg',
//   },
// ];

type Album = {
  encodedId: string;
  title: string;
  artistsNames: string;
  thumbnail: string;
};

type SongResult = {
  encodeId: string;
  title: string;
  artistsNames: string;
  thumbnail: string;
  thumbnailM: string;
  album: Album;
};

const SearchView = ({searchValue}: Props) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [searchError, setSearchError] = React.useState<string | null>(null);
  const [searchResult, setSearchResult] = React.useState<SongResult[]>([]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleSearch();
    }, 200);

    return () => clearTimeout(timeout);
  }, [searchValue]);

  const handleSearch = async () => {
    try {
      const res = await fetch(API_URL + '/search?q=' + searchValue);
      let data = await res.json();
      setSearchResult(data.data.data.songs);
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        setSearchError(error.message);
      }
    }
  };

  const playSong = async (song: SongResult) => {
    try {
      const res = await fetch(API_URL + '/song/detail?id=' + song.encodeId);
      let data = await res.json();
      const track: Track = {
        id: song.encodeId,
        url: data.data.data['128'],
        title: song.title,
        artist: song.artistsNames,
        artwork: song.thumbnailM,
      };

      // Hiện player trước rồi mới load bài hát
      await TrackPlayer.load(track);

      // FIXME: Sửa cho transition từ artwork trước sang không bị flicker
      // @ts-ignore
      await new Promise(resolve => setTimeout(resolve, 300));
      navigation.navigate('Player');

      await TrackPlayer.play();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.resultContainer}>
        {searchError ||
          (searchResult.length > 0 &&
            searchResult.map((song, index) => {
              return (
                <TouchableNativeFeedback
                  key={song.encodeId}
                  background={TouchableNativeFeedback.Ripple('#00000011', false)}
                  onPress={() => playSong(song)}>
                  <View style={styles.songResult}>
                    <Image
                      source={{uri: song.thumbnail}}
                      defaultSource={require('../../../assets/default_song_thumbnail.png')}
                      style={{width: 45, height: 45, borderRadius: 7}}
                    />
                    <View style={{marginRight: 'auto'}}>
                      <Text style={{fontSize: 13, color: COLORS.TEXT_PRIMARY}}>
                        {song.title && song.title.length > 40
                          ? song.title.substring(0, 40) + '...'
                          : song.title}
                      </Text>
                      <Text style={{fontSize: 13, color: COLORS.TEXT_GRAY}}>
                        {song.artistsNames && song.artistsNames.length > 40
                          ? song.artistsNames.substring(0, 40) + '...'
                          : song.artistsNames}
                      </Text>
                    </View>
                    <TouchableNativeFeedback
                      hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
                      background={TouchableNativeFeedback.Ripple('#00000011', true, 30)}>
                      <View>
                        <IonIcon name="ios-ellipsis-vertical" size={20} color={COLORS.TEXT_GRAY} />
                      </View>
                    </TouchableNativeFeedback>
                  </View>
                </TouchableNativeFeedback>
              );
            }))}
      </View>
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
  songResult: {
    paddingHorizontal: 15,
    paddingVertical: 7,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
});

export default SearchView;
