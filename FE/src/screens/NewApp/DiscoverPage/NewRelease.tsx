import {memo, useEffect, useMemo, useState} from 'react';
import {Text, View, StyleSheet, ScrollView, Dimensions} from 'react-native';
import {COLORS} from '../../../constants';
import {Song} from '../../../types';
import ListSong from '../../../components/ListSong';
export type ItemReleases = {
  all: Song[];
  vPop: Song[];
  others: Song[];
};
type Props = {
  items: ItemReleases;
};
export const NewRelease = memo(({items}: Props) => {
  const [data, setData] = useState<Song[][]>([]);
  const [type, setType] = useState<number>(1);
  const screenWidth = Dimensions.get('window').width;

  const buildData = () => {
    console.log(items.vPop.length);
    const releases = type === 1 ? [...items.all] : type === 2 ? [...items.vPop] : [...items.others];

    if (releases && releases.length > 0) {
      const lengthMax =
        releases.length % 4 === 0 ? releases.length / 4 : Math.floor(releases.length / 4) + 1;
      const dataBuild = Array.from({length: lengthMax}, () => releases.splice(0, 4));
      setData(dataBuild);
    }
  };

  useEffect(() => {
    console.log('type release', type);
    buildData();
  }, [items, type]);

  const ColumnNewRelease = ({items}: {items: Song[]}) => {
    return useMemo(() => {
      return (
        <View style={{flexDirection: 'column', width: screenWidth, paddingHorizontal: 3}}>
          {items && items.length > 0 && <ListSong songs={items} paddingVertical={7} />}
        </View>
      );
    }, [data, type]);
  };

  return (
    <View style={{flexDirection: 'column', marginTop: 25}}>
      <View style={{marginBottom: 10, paddingLeft: 17}}>
        <Text style={{fontSize: 22, color: 'black', fontWeight: '700'}}>Mới phát hành</Text>
      </View>
      <View style={{flexDirection: 'row', gap: 7, paddingLeft: 17, marginBottom: 10}}>
        <Text
          style={[styles.chipButton, type === 1 ? styles.chipSelected : {}]}
          onPress={() => setType(1)}>
          Tất cả
        </Text>
        <Text
          style={[styles.chipButton, type === 2 ? styles.chipSelected : {}]}
          onPress={() => setType(2)}>
          Việt Nam
        </Text>
        <Text
          style={[styles.chipButton, type === 3 ? styles.chipSelected : {}]}
          onPress={() => setType(3)}>
          Quốc tế
        </Text>
      </View>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} pagingEnabled={true}>
        <View style={{display: 'flex', flexDirection: 'row'}}>
          {data &&
            data.map((item: Song[], index) => {
              return <ColumnNewRelease items={item} key={index} />;
            })}
        </View>
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  chipButton: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 3,
    color: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#cccccc',
  },
  chipSelected: {
    backgroundColor: COLORS.PURPLE_ZING,
    color: 'white',
    borderWidth: 0,
  },
});
