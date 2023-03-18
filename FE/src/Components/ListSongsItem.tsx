import React, {useEffect} from 'react';
import {useState} from 'react';
import {Text, View} from 'react-native';
import {ZingMp3} from 'zingmp3-api-full-v2/dist';

function ListSongsItem() {
  const [data, setData] = useState();

  useEffect(() => {
    const getData = async () => {
      const results = await ZingMp3.getDetailPlaylist('60B8U0OB');
      setData(results);
      console.log(results);
    };
    getData();
  });
  return (
    <View>
      <Text>{data}</Text>
    </View>
  );
}

export default ListSongsItem;
