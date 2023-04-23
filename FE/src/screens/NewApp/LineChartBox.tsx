import { View, Text, StyleSheet } from 'react-native';
import TopBox from '../../components/TopBox';
import ItemSong from '../../components/ItemSong';
import Chart from '../../components/Chart';
const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June'],
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
      withDots: false,
    },
    {
      data: [50, 55, 78, 10, 20, 13],
      color: (opacity = 1) => `rgba(55, 50, 10, ${opacity})`,
      strokeWidth: 2,
      withDots: false,
    },
  ],
};

const LineChartBox = () => {
  return (
    <View style={[styles.boxChart]}>
      <Text
        style={{
          paddingTop: 10,
          paddingLeft: 10,
          fontWeight: '900',
          fontSize: 20,
          paddingBottom: 5,
        }}>
        TopMusic
      </Text>
      <Chart data={data} />
      <View style={{ paddingLeft: 20, paddingTop: 10 }}>
        <TopBox number={1} color="blue">
          <ItemSong
            nameSong="Ten bai hat"
            artistName="Ha Anh Tuan"
            image="https://th.bing.com/th/id/R.c8e77fefb031b2515ff3cd3de4cb3062?rik=AVvYYwPKlxtvNw&pid=ImgRaw&r=0"
            size={60}
            date="Hom nay"
          />
        </TopBox>
        <TopBox number={2} color="red">
          <ItemSong
            nameSong="Ten bai hat"
            artistName="Ha Anh Tuan"
            image="https://th.bing.com/th/id/R.c8e77fefb031b2515ff3cd3de4cb3062?rik=AVvYYwPKlxtvNw&pid=ImgRaw&r=0"
            size={60}
            date="Hom nay"
          />
        </TopBox>
        <TopBox number={3} color="orange">
          <ItemSong
            nameSong="Ten bai hat"
            artistName="Ha Anh Tuan"
            image="https://th.bing.com/th/id/R.c8e77fefb031b2515ff3cd3de4cb3062?rik=AVvYYwPKlxtvNw&pid=ImgRaw&r=0"
            size={60}
            date="Hom nay"
          />
        </TopBox>
      </View>
    </View>
  );
};

export default LineChartBox;

const styles = StyleSheet.create({
  boxChart: {
    height: 500,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'black',
    position: 'relative',
    zIndex: 1,
    marginTop: 20,
  },
});
