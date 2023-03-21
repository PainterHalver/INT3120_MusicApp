import {Dimensions} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {LineChartData} from 'react-native-chart-kit/dist/line-chart/LineChart';

type Props = {
  data: LineChartData;
};
const Chart = (props: Props) => {
  const screenWidth = Dimensions.get('window').width - 22;

  const chartConfig = {
    backgroundGradientFrom: 'white',
    backgroundGradientTo: 'white',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 100,
  };

  return (
    <LineChart
      data={props.data}
      width={screenWidth}
      height={220}
      chartConfig={chartConfig}
      withInnerLines={false}
      withVerticalLines={false}
      fromZero={true}
      withShadow={false}
    />
  );
};

export default Chart;
