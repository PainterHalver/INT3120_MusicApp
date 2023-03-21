import {View, Text, Image} from 'react-native';
type Props = {
  description: string;
  image: string;
  size: number;
};
const ItemArtist = ({description, image, size}: Props) => {
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
        source={{uri: image}}
        style={{
          height: size,
          width: size,
          borderRadius: size,
        }}
      />
      <Text style={{overflow: 'hidden', color: '#ddd'}}>{description}</Text>
    </View>
  );
};

export default ItemArtist;
