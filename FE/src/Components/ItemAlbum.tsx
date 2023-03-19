import {View, Text, Image} from 'react-native';
type Props = {
    description: string;
    image: string;
    size:number;
};
const ItemSong = ({description,image, size}:Props) => {
    return (
      <View style={{flexDirection: 'column', width: size, marginHorizontal:5}}>
        <Image
        source={{uri:image}}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: size,
            width: size,
            borderRadius: 10,
          }}
        />
        <Text style={{overflow:'hidden'}}>{description}</Text>
      </View>
    );
  };


export default ItemSong;