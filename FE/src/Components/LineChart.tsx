import {View, Text, StyleSheet} from 'react-native';

const LineChart = ()=> {
    return (
    <View style={[styles.boxChart]}>
        <Text style={{paddingTop:10, paddingLeft:10}}>TopMusicChart</Text>
    </View>
    )
}

export default LineChart

const styles = StyleSheet.create({
    boxChart: {
        height:500,
        // backgroundColor:linear-gradient(blue, pink),
        borderRadius:20,
        borderWidth:1,
        borderColor: 'black'
    }
  });