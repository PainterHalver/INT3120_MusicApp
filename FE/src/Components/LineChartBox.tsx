import {View, Text, StyleSheet} from 'react-native';
import { Dimensions } from "react-native";
import {LineChart} from "react-native-chart-kit";
import TopBox from './TopBox';
const data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: (opacity = 1) => `rgba(50, 50, 255, ${opacity})`, 
        strokeWidth: 2,
      },
      {
        data: [40, 25, 68, 20, 59, 83],
        color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, 
        strokeWidth: 2,
        withDots:false,
      },
      {
        data: [50, 55, 78, 10, 20, 13],
        color: (opacity = 1) => `rgba(55, 50, 10, ${opacity})`, 
        strokeWidth: 2 ,
        withDots:false,
      }
    ],
};

const LineChartBox = ()=> {
    const screenWidth = Dimensions.get("window").width-22;
    
    const chartConfig = {
        backgroundGradientFrom: "white",
        backgroundGradientTo: "white",
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        strokeWidth: 100, 
    };

    return (
    <View style={[styles.boxChart]}>
        <Text style={{paddingTop:10, paddingLeft:10, fontWeight: '900', fontSize: 20, paddingBottom:5}}>TopMusic</Text>
        <LineChart
            data={data}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
            withInnerLines={false}
            withVerticalLines={false}
            fromZero={true}
            withShadow={false}
        />
        <View style={{paddingLeft:20, paddingTop:10}}>
            <TopBox number={1} color="blue"/>
            <TopBox number={2} color="red"/>
            <TopBox number={3} color="orange"/>
        </View>
    </View>
    )
}

export default LineChartBox

const styles = StyleSheet.create({
    boxChart: {
        height:500,
        borderRadius:20,
        borderWidth:1,
        borderColor: 'black',
        position: 'relative',
        zIndex:1,
    }
  });