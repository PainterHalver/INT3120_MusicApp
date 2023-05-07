import { CompositeScreenProps, useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { Platform, ScrollView, StatusBar, Text, TouchableNativeFeedback, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import TrackPlayer from 'react-native-track-player';
import { ChartDetailParamList } from '..';
import { ZingMp3 } from '../../../ZingMp3';
import Chart from '../../../components/Chart';
import VerticalItemSong from '../../../components/VerticalItemSong';
import { useLoadingModal } from '../../../contexts/LoadingModalContext';
import { Playlist, Song, songsToTracks } from '../../../types';
import WeekChartItem from '../WeekChartItem';
import { BottomTabParamList, RootStackParamList } from '../../../../App';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { LineChartData } from 'react-native-chart-kit/dist/line-chart/LineChart';

type Props = {
  isChartHome?: boolean,
}

type time = {
  hour: string,
}

type DataChart = {
  RTChart: {
    items: Song[],
    chart: {
      times: time[],
      items: {
        [key: string]: Array<{
          time: number,
          hour: string,
          counter: number
        }>
      },
    },
  }
  weekChart: {
    [key: string]: Playlist
  }
}


const ChartMainPage = ({ isChartHome = false }: Props) => {
  const navigation = useNavigation()
  const { setLoading } = useLoadingModal();
  const [chartData, setChartData] = useState<LineChartData>();
  const [songs, setSongs] = useState<Song[]>([]);
  const [weekCharts, setWeekCharts] = useState({});

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('light-content');
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
    }, []),
  );

  useEffect(() => {
    const getData = async () => {
      const data: DataChart = await ZingMp3.getChartHome();
      const items = data.RTChart.chart.items;
      const times = data.RTChart.chart.times;
      const chart: LineChartData = { labels: [], datasets: [] };
      const weekChart = data.weekChart;


      // for (let i = 0; i < times.length; i++) {
      //   if (i % 2 == 0) chart.labels.push(times[i].hour);
      //   else chart.labels.push('');
      //   i++;
      // }


      Object.keys(items).forEach(element => {
        const dataLine = items[element].slice(-12);
        chart.datasets.push({
          data: dataLine.map((item) => {
            return item.counter;
          }),
        });
        chart.labels = dataLine.map(item => {
          return item?.hour
        })
      });

      let i = 0;
      const titles = ['V-POP', 'US-UK', 'KPOP'];

      Object.keys(weekChart).forEach(element => {
        weekChart[element].title = titles[i];
        i++;
      });
      //console.log(chart);
      chart.datasets.forEach(element => {
        element.strokeWidth = 2;
        element.withDots = false;
      });
      chart.datasets[0].color = (opacity = 1) => `rgba(39,138,195, ${1})`;
      chart.datasets[1].color = (opacity = 1) => `rgba(48,176,143, ${1})`;
      chart.datasets[2].color = (opacity = 1) => `rgba(197,101,54, ${1})`;
      chart.datasets[0].withDots = true
      setChartData(chart);
      setSongs(isChartHome === false ? data.RTChart.items : data.RTChart.items.slice(0, 5));
      setWeekCharts(weekChart);
    };
    getData();
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
    <View style={{ flex: 1, backgroundColor: 'rgba(32,19,53,0.9)' }}>
      <StatusBar
        translucent
        barStyle={'light-content'}
        backgroundColor={'transparent'}
        animated={true}
      />
      <View style={{ flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
        <ScrollView>
          <Text
            style={{
              fontSize: 30,
              fontWeight: '900',
              marginBottom: 20,
              marginTop: 10,
              color: '#ddd',
              marginLeft: '5%',
            }}>
            #Top
          </Text>
          {chartData && <Chart data={chartData} />}
          {songs.length != 0 && (
            <View
              style={{
                backgroundColor: 'rgba(32,19,53,0.9)',
                borderTopStartRadius: 15,
                borderTopEndRadius: 15,
                height: '100%',
              }}>
              {songs.map((song, index) => (
                <TouchableNativeFeedback
                  key={index}
                  onPress={() => {
                    playSongInPlaylist(song, index);
                  }}>
                  <View>
                    <VerticalItemSong key={index} pos={index} song={song} chart={true} />
                  </View>
                </TouchableNativeFeedback>
              ))}
              {weekCharts && isChartHome === false && (
                <View
                  style={{
                    borderTopStartRadius: 15,
                    borderTopEndRadius: 15,
                    backgroundColor: 'hsla(0,0%,100%,0.05)',
                    paddingBottom: 15,
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: '900',
                      marginBottom: 5,
                      marginTop: 20,
                      color: '#ddd',
                      marginLeft: '5%',
                    }}>
                    Weekly ranking
                  </Text>
                  {Object.keys(weekCharts).map((element, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        navigation.push('WeekChartDetail', { weekChart: weekCharts[element] });
                      }}>
                      <WeekChartItem
                        data={weekCharts[element].items.slice(0, 3)}
                        image={weekCharts[element].items[0].thumbnail}
                        size={100}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default ChartMainPage;
