import {View, Text} from 'react-native';

type Props = {
  number: number;
  color?: string;
  size?: number;
  children: JSX.Element;
};
const TopBox = (props: Props) => {
  return (
    <View style={{display: 'flex', flexDirection: 'row', paddingVertical: 5}}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            fontWeight: '900',
            fontSize: 20,
            paddingRight: 15,
            color: `${props.color ? props.color : 'black'}`,
          }}>
          {props.number}
        </Text>
      </View>
      {props.children}
    </View>
  );
};

export default TopBox;
