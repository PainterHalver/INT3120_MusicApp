import { View, Text, Image } from 'react-native';
import { COLORS } from '../constants';

type Props = {
  description: string;
  image: string;
  size: number;
};
const ItemAlbum = ({ description, image, size }: Props) => {
  return (
    <View
      style={{
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: size,
        marginHorizontal: 5,
      }}>
      <Image
        source={{ uri: image }}
        style={{
          height: size,
          width: size,
          borderRadius: 10,
        }}
      />
      <Text style={{ overflow: 'hidden', color: COLORS.TEXT_GRAY }}>{description}</Text>
    </View>
  );
};

export default ItemAlbum;
