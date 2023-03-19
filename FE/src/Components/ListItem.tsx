import ItemSong from './ItemSong';
import {View, Text,ScrollView} from 'react-native';
type Props = {
    name: string;
    data: Array<{description:string,image:string}>;
};
const ListItem = ({name,data}:Props) => {
    return (
      <View style={{flexDirection: 'column', paddingTop: 15}}>
        <View>
          <Text style={{fontSize: 25, color: 'black'}}>{name}</Text>
        </View>
        <ScrollView style={{paddingBottom: 10}}
            horizontal={true}
        >
            {data&&data.length>0?data.map((item,index)=>{
                return (
                    <ItemSong description={item.description} image={item.image} size={120} key={index} />
                )
            }):null}
        </ScrollView>
      </View>
    );
  };

export default ListItem;
