import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {Image, StyleSheet, Text, TouchableNativeFeedback, View} from 'react-native';
import TrackPlayer, {Track} from 'react-native-track-player';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {RootStackParamList} from '../../../App';
import SongBottomSheet from '../../components/SongBottomSheet';
import {COLORS} from '../../constants';
import {useDatabase} from '../../contexts/DatabaseContext';
import {usePlayer} from '../../contexts/PlayerContext';
import {Song} from '../../types';
import {ZingMp3} from '../../zingmp3';

interface Props {}

const HistoryView = ({}: Props) => {
  const {setSelectedSong} = usePlayer();
  const {getTopSongSearchHistory} = useDatabase();
  const songBottonSheetRef = React.useRef<BottomSheetModal>(null);
  const [historySongs, setHistorySongs] = React.useState<Song[]>([]);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    (async () => {
      const songs = await getTopSongSearchHistory(10);
      setHistorySongs(songs);
    })();
  }, []);

  const playSong = async (song: Song) => {
    try {
      const data = await ZingMp3.getSong(song.encodeId);
      const track: Track = {
        id: song.encodeId,
        url: data.data['128'],
        title: song.title,
        artist: song.artistsNames,
        artwork: song.thumbnailM,
      };

      // Hiện player trước rồi mới load bài hát
      navigation.navigate('Player');

      await TrackPlayer.load(track);
      await TrackPlayer.play();
    } catch (error) {
      console.log(error);
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
          Nghe gần đây
        </Text>
        {historySongs.length > 0 &&
          historySongs.map((song, index) => {
            return (
              <TouchableNativeFeedback
                key={song.encodeId}
                background={TouchableNativeFeedback.Ripple('#00000011', false)}
                onPress={() => playSong(song)}>
                <View style={styles.songResult}>
                  <View style={{position: 'relative', width: 45, height: 45}}>
                    <Image
                      source={require('../../../assets/default_song_thumbnail.png')}
                      style={{width: 45, height: 45, borderRadius: 7, position: 'absolute'}}
                    />
                    <Image
                      source={{uri: song.thumbnail}}
                      style={{width: 45, height: 45, borderRadius: 7, position: 'absolute'}}
                    />
                  </View>
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
                    background={TouchableNativeFeedback.Ripple('#00000011', true, 30)}
                    onPress={() => {
                      setSelectedSong(song);
                      songBottonSheetRef.current?.present();
                    }}>
                    <View>
                      <IonIcon name="ios-ellipsis-vertical" size={20} color={COLORS.TEXT_GRAY} />
                    </View>
                  </TouchableNativeFeedback>
                </View>
              </TouchableNativeFeedback>
            );
          })}
      </View>
      <SongBottomSheet ref={songBottonSheetRef} />
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
  songResult: {
    paddingHorizontal: 15,
    paddingVertical: 7,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
});

export default HistoryView;
