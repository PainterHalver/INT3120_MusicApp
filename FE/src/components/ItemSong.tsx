import { View, Text, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

type Props = {
  nameSong: string;
  artistName: string;
  date?: string;
  image: string;
  size: number;
  select?: boolean;
  myKey?: string
};
const ItemSong = (props: Props) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'space-between',
        flex: 1,
      }} key={props.myKey}>
      <View style={{ flexDirection: 'row', gap: 10, borderColor: 'black' }}>
        <View>
          <Image
            source={{ uri: props.image }}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: props.size,
              width: props.size,
              borderRadius: 10,
              borderColor: 'green',
              borderWidth: props.select ? 4 : 0,
            }}
          />
        </View>
        <View style={{ flexDirection: 'column' }}>
          <Text>{props.nameSong}</Text>
          <Text>{props.artistName}</Text>
          {props.date ? <Text>{props.date}</Text> : null}
        </View>
      </View>
      <View style={{ display: 'flex', justifyContent: 'center', paddingRight: 10 }}>
        <Text>
          <Icon name="ellipsis-v" size={20} color="black" style={{ fontWeight: '200' }} />
        </Text>
      </View>
    </View>
  );
};

export default ItemSong;
