import { View, Text, StyleSheet, TouchableNativeFeedback, Button } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ChartMainPage from '../../ChartDetail/ChartMainPage';
import { useNavigation } from '@react-navigation/native';

const LineChartBox = () => {
  const navigation = useNavigation()
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
      <ChartMainPage isChartHome={true} />
      <View style={{ height: 60, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontWeight: 'bold', borderWidth: 1, borderColor: '#cccccc', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 }} onPress={() => {
          navigation.navigate('ChartDetail')
        }}>
          XEM THÊM
        </Text>
      </View>
    </View>
  );
};

export default LineChartBox;

const styles = StyleSheet.create({
  boxChart: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'black',
    position: 'relative',
    zIndex: 1,
    marginTop: 20,
    marginHorizontal: 10,
  },
});
