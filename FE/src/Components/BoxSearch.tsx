import Icon from 'react-native-vector-icons/FontAwesome';
import {View, TextInput, Text, StyleSheet} from 'react-native';
const BoxSearch = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          paddingVertical: 10,
        }}>
        <View
          style={{
            borderWidth: 1,
            borderRadius: 50,
            justifyContent: 'center',
            alignItems: 'center',
            height: 30,
            width: 30,
          }}>
          <Icon
            name="user"
            size={20}
            color="black"
            style={{fontWeight: '200'}}
          />
        </View>
        <View
          style={{
            paddingHorizontal: 5,
            borderWidth: 1,
            borderColor: 'black',
            borderRadius: 20,
            flex: 1,
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <Text style={{paddingRight: 10}}>
            <Icon
              name="search"
              size={20}
              color="black"
              style={{fontWeight: '200'}}
            />
          </Text>
          <TextInput
            style={styles.inputSearch}
            placeholder="Tìm kiếm bài hát, nghệ sĩ"
          />
          <Text style={{paddingRight: 10}}>
            <Icon
              name="microphone"
              size={20}
              color="blue"
              style={{fontWeight: '200'}}
            />
          </Text>
        </View>
        <View
          style={{
            borderRadius: 50,
            justifyContent: 'center',
            alignItems: 'center',
            height: 30,
            width: 30,
          }}>
          <Icon
            name="bell"
            size={20}
            color="black"
            style={{fontWeight: '200'}}
          />
        </View>
      </View>
    );
  };
export default BoxSearch

  const styles = StyleSheet.create({
    inputSearch: {
      flex: 1,
      lineHeight: 35,
      textAlignVertical: 'center',
      padding: 0,
    },
    chipButton: {
      borderRadius: 20,
      borderWidth: 1,
      paddingHorizontal: 5,
      paddingVertical: 3,
    },
  });