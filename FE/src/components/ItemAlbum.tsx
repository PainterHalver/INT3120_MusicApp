import {View, Text, Image} from 'react-native';
import {COLORS} from '../constants';

type Props = {
  description: string;
  image: string;
  size: number;
};
const ItemAlbum = ({description, image, size}: Props) => {
  return (
    <View
      style={{
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: size,
        marginHorizontal: 7,
      }}>
      {image !== '' && image ? (
        <Image
          source={{uri: image}}
          style={{
            height: size,
            width: size,
            borderRadius: 10,
            marginBottom: 7,
          }}
        />
      ) : null}
      <Text style={{overflow: 'hidden', color: COLORS.TEXT_GRAY, fontSize: 12.3}}>{description}</Text>
    </View>
  );
};

export default ItemAlbum;
