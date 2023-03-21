import ItemSong from "./ItemSong"
import {
    View,
    Text
  } from 'react-native';
  
type Props = {
    number: number,
    color?: string,
    size?: number,
}
const TopBox = (props:Props) => {
    return (<View style={{display:"flex", flexDirection:'row', paddingVertical:5}}>
                <View style={{display:'flex',flexDirection:'column', justifyContent:"center"}}>
                    <Text style={{fontWeight:'900', fontSize:20,paddingRight:15, color:`${props.color?props.color:'black'}`}}>{props.number}</Text>
                </View>
                <ItemSong select={true} nameSong='Ten bai hat' artistName='Ha Anh Tuan' image='https://th.bing.com/th/id/R.c8e77fefb031b2515ff3cd3de4cb3062?rik=AVvYYwPKlxtvNw&pid=ImgRaw&r=0' size={60} date="Hom nay"/>
            </View>
    )
}

export default TopBox