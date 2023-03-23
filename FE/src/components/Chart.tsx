import {Dimensions} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {LineChartData} from 'react-native-chart-kit/dist/line-chart/LineChart';
import {View} from 'react-native';

type Props = {
  data: LineChartData;
};
const Chart = (props: Props) => {
  const screenWidth = Dimensions.get('window').width - 20;

  const chartConfig = {
    backgroundColor: 'rgba(41,21,71,0.8)',
    backgroundGradientFrom: 'rgba(32,19,53,0.9)',
    backgroundGradientTo: 'rgba(32,19,53,0.9)',
    backgroundGradientFromOpacity: 0,
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    strokeWidth: 100,
  };

  return (
    <LineChart
      style={{
        backgroundColor: 'rgba(32,19,53,0)',
        paddingBottom: 5,
        borderBottomEndRadius: 20,
        borderBottomStartRadius: 20,
        marginHorizontal: 10,
      }}
      data={props.data}
      width={screenWidth}
      height={210}
      chartConfig={chartConfig}
      withInnerLines={true}
      withVerticalLines={false}
      fromZero={true}
      withShadow={false}
      withHorizontalLabels={true}
      bezier
    />
  );
};

export default Chart;
