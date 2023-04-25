import {useFocusEffect} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import React from 'react';
import {
  Image,
  ImageBackground,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import TrackPlayer from 'react-native-track-player';
import {ChartDetailParamList} from '..';
import VerticalItemSong from '../../../components/VerticalItemSong';
import {useLoadingModal} from '../../../contexts/LoadingModalContext';
import {Song, songsToTracks} from '../../../types';

type Props = StackScreenProps<ChartDetailParamList>;

const WeekChartDetail = ({navigation, route}: Props) => {
  const {setLoading} = useLoadingModal();

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('light-content');
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
    }, []),
  );

  const playSongInPlaylist = async (track: Song, index: number) => {
    try {
      setLoading(true);
      const tracks = songsToTracks(route.params.weekChart.items);

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
      source={{uri: route.params.weekChart.banner}}
      resizeMode="cover"
      style={{width: '100%', height: '100%'}}
      blurRadius={4}>
      <View style={styles.wrapper}>
        <View style={styles.playlistInfo}>
          <Image
            source={{
              uri: route.params.weekChart.cover,
            }}
            resizeMode="contain"
            style={{
              height: '60%',
              aspectRatio: 1,
              borderRadius: 15,
            }}
          />
          <Text style={styles.title}>{`Top ${route.params.weekChart.country}`}</Text>
        </View>
        <ScrollView
          style={{
            height: '50%',
          }}>
          {route.params.weekChart.items.map((song, index) => {
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

export default WeekChartDetail;
