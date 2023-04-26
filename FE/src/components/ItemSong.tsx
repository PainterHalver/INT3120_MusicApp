import { View, Text, Image, TouchableNativeFeedback, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { useBottomSheet } from '../contexts/BottomSheetContext';
import { COLORS } from '../constants';

type Props = {
  nameSong: string;
  artistName: string;
  date?: string;
  image: string;
  size: number;
  select?: boolean;
};
const ItemSong = (props: Props) => {
  const { setSelectedSong, songBottomSheetRef } = useBottomSheet();
  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'space-between',
        flex: 1,
      }}>
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
      <TouchableNativeFeedback
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        background={TouchableNativeFeedback.Ripple(COLORS.RIPPLE_LIGHT, true, 30)}
        onPress={() => {
          // setSelectedSong(song);
          Keyboard.dismiss();
          songBottomSheetRef.current?.present();
        }}>
        <View>
          <IonIcon name="ios-ellipsis-vertical" size={20} color={'black'} />
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};

export default ItemSong;
