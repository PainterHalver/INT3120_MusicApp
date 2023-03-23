import React from 'react';
import {View, Text, Image, ImageBackground} from 'react-native';
type Props = {
  data: [];
  size: number;
  image: string;
};

const WeekChartItem = ({data, size, image}: Props) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        marginHorizontal: '5%',
        borderRadius: 10,
        marginTop: 20,
      }}>
      <Image
        source={{uri: image}}
        style={{
          height: size,
          width: size,
          borderRadius: 15,
        }}
      />
      <View style={{marginLeft: 15}}>
        {data.map((element, index) => (
          <Text key={index} style={{fontWeight: '400', fontSize: 16, color: '#ddd'}}>{`${index + 1}. ${element.title}`}</Text>
        ))}
      </View>
    </View>
  );
};

export default WeekChartItem;
