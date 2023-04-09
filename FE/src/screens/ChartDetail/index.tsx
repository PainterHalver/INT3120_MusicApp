import React, {useEffect, useState} from 'react';
import {View, ScrollView, Text, StatusBar, Platform} from 'react-native';
import Chart from '../../components/Chart';
import axios from 'axios';
import {ImageBackground} from 'react-native';
import VerticalItemSong from '../../components/VerticalItemSong';
import WeekChartItem from './WeekChartItem';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps, useFocusEffect} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {BottomTabParamList, RootStackParamList} from '../../../App';
import {ZingMp3} from '../../ZingMp3';

type Props = CompositeScreenProps<
  BottomTabScreenProps<BottomTabParamList, 'ChartDetail'>,
  StackScreenProps<RootStackParamList>
>;

const ChartDetail = ({}: Props) => {
  const [chartData, setChartData] = useState();
  const [songs, setSongs] = useState([]);
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
      const data = await ZingMp3.getChartHome();
      const items = data.data.RTChart.chart.items;
      const times = data.data.RTChart.chart.times;
      const chart = {labels: [], datasets: []};
      const weekChart = data.data.weekChart;

      let i = 0;
      Object.keys(times).forEach(element => {
        if (i % 2 == 0) chart.labels.push(times[element].hour);
        else chart.labels.push('');
        i++;
      });
      i = 0;
      Object.keys(items).forEach(element => {
        chart.datasets.push({
          data: items[element].map(item => {
            return item.counter;
          }),
        });
      });
      i = 0;
      const titles = ['V-POP', 'US-UK', 'KPOP'];

      Object.keys(weekChart).forEach(element => {
        weekChart[element].items = weekChart[element].items.slice(0, 3);
        weekChart[element].title = titles[i];
        i++;
      });
      i = null;
      //console.log(chart);
      chart.datasets.forEach(element => {
        element.strokeWidth = 2;
        element.withDots = false;
      });
      chart.datasets[0].color = (opacity = 5) => `rgba(74, 144, 226, ${opacity})`;
      chart.datasets[1].color = (opacity = 5) => `rgba(80, 227, 194, ${opacity})`;
      chart.datasets[2].color = (opacity = 5) => `rgba(227, 80, 80, ${opacity})`;
      setChartData(chart);
      setSongs(data.data.RTChart.items);
      setWeekCharts(weekChart);
    };
    getData();
  }, []);
  return (
    <View style={{flex: 1, backgroundColor: 'rgba(32,19,53,0.9)'}}>
      <StatusBar
        translucent
        barStyle={'light-content'}
        backgroundColor={'transparent'}
        animated={true}
      />
      <View style={{flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0}}>
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
                <VerticalItemSong
                  key={index}
                  pos={index}
                  thumbnail={song.thumbnail}
                  artistsNames={song.artistsNames}
                  title={song.title}
                  chart={true}
                />
              ))}
              {weekCharts && (
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
                    <WeekChartItem
                      key={index}
                      data={weekCharts[element].items}
                      image={weekCharts[element].items[0].thumbnail}
                      size={100}
                    />
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

export default ChartDetail;
