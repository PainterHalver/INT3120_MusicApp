import React, {useEffect, useState} from 'react';
import {View, ScrollView} from 'react-native';
import LineChartBox from '../src/Screens/LineChartBox';
import Chart from '../src/Components/Chart';
import axios from 'axios';
import {ImageBackground} from 'react-native';
import VerticalItemSong from '../src/Components/VerticalItemSong';

const ChartDetail = () => {
  const [chartData, setChartData] = useState();
  const [songs, setSongs] = useState([]);
  const [weekCharts, setWeekCharts] = useState([]);
  useEffect(() => {
    const getData = async () => {
      const data = await axios.get('http://10.0.2.2:5000/chart', {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      //console.log(data.data.chart);
      data.data.chart.datasets.forEach(element => {
        element.strokeWidth = 2;
        element.withDots = false;
      });
      data.data.chart.datasets[0].color = (opacity = 5) => `rgba(74, 144, 226, ${opacity})`;
      data.data.chart.datasets[1].color = (opacity = 5) => `rgba(80, 227, 194, ${opacity})`;
      data.data.chart.datasets[2].color = (opacity = 5) => `rgba(227, 80, 80, ${opacity})`;
      setChartData(data.data.chart);
      setSongs(data.data.songs);
      setWeekCharts(data.data.weekCharts);
    };
    getData();
  }, []);
  return (
    <ScrollView style={{backgroundColor: 'rgba(32,19,53,0.9)'}}>
      {chartData && <Chart data={chartData} />}
      {songs.length != 0 && (
        <View
          style={{
            backgroundColor: 'rgba(32,19,53,0.9)',
            borderTopStartRadius: 15,
            borderTopEndRadius: 15,
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
                backgroundColor: 'rgba(32,19,53,0.9)',
                borderTopStartRadius: 15,
                borderTopEndRadius: 15,
                opacity: 0.6,
              }}>
                
              </View>
          )}
        </View>
      )}
    </ScrollView>
  );
};

export default ChartDetail;
