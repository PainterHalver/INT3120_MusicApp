import Icon from 'react-native-vector-icons/FontAwesome';
import {View, TextInput, Text, StyleSheet} from 'react-native';
import {SearchIcon} from '../icons/SearchIcon';
import {COLORS} from '../constants';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {Pressable} from 'react-native';

import {BottomTabParamList} from '../../App';
import {ProfileIcon} from './ProfileIcon';

const BoxSearch = () => {
  const navigation = useNavigation<NavigationProp<BottomTabParamList>>();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 10,
        marginTop: 40,
      }}>
      <Pressable
        onPress={() => {
          navigation.navigate('MyPlaylists', {screen: 'Profile', initial: false});
        }}>
        <ProfileIcon size={30} />
      </Pressable>
      <Pressable
        onPress={() => navigation.navigate('Search', {shouldFocusSearchBar: true})}
        style={{flex: 1}}>
        <View
          style={{
            paddingHorizontal: 5,
            borderRadius: 20,
            backgroundColor: 'white',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <Text style={{paddingHorizontal: 5}}>
            <SearchIcon size={15} color={COLORS.TEXT_GRAY} />
          </Text>
          <TextInput
            editable={false}
            style={styles.inputSearch}
            placeholder="Tìm kiếm bài hát, nghệ sĩ..."
          />
        </View>
      </Pressable>
      <View
        style={{
          borderRadius: 50,
          justifyContent: 'center',
          alignItems: 'center',
          height: 30,
          width: 30,
        }}>
        <Icon name="bell" size={20} color="black" style={{fontWeight: '200'}} />
      </View>
    </View>
  );
};
export default BoxSearch;

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
