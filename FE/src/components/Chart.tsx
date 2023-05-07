import { Dimensions, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { LineChartData } from 'react-native-chart-kit/dist/line-chart/LineChart';
import { View } from 'react-native';
import { useEffect, useState } from 'react';

type Props = {
  data: LineChartData;
};
const Chart = (props: Props) => {
  const screenWidth = Dimensions.get('window').width - 10;

  const chartConfig = {
    backgroundColor: 'rgba(41,21,71,0.8)',
    backgroundGradientFrom: 'rgba(32,19,53,0.9)',
    backgroundGradientTo: 'rgba(32,19,53,0.9)',
    backgroundGradientFromOpacity: 0,
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    strokeWidth: 2,
    propsForDots: {
      r: "5",
    },
  };

  return (
    <LineChart
      style={{
        backgroundColor: 'rgba(32,19,53,0)',
        paddingBottom: 5,
        borderBottomEndRadius: 20,
        borderBottomStartRadius: 20,
        marginHorizontal: 10,
        paddingRight: 10,
      }}
      data={props.data}
      width={screenWidth}
      height={210}
      chartConfig={chartConfig}
      withInnerLines={false}
      withVerticalLines={false}
      fromZero={true}
      withShadow={false}
      withHorizontalLabels={false}
      renderDotContent={({ x, y, index }) => {
        return <View key={index + x + y
        } style={{
          height: 5,
          width: 5,
          borderRadius: 1000,
          backgroundColor: "white",
          position: "absolute",
          top: y - 2,
          left: x - 2,
        }} />;
      }}
    />
  );
};

export default Chart;
