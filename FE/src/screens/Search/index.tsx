import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  Dimensions,
  View,
  TouchableHighlight,
  TextInput,
} from 'react-native';
import React from 'react';
import {CompositeScreenProps, useFocusEffect} from '@react-navigation/native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {StackScreenProps} from '@react-navigation/stack';
import {BottomTabParamList, RootStackParamList} from '../../../App';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {Pressable} from 'react-native';
import {SearchIcon} from '../../icons/SearchIcon';
import {COLORS} from '../../constants/Colors';
import {Shadow} from 'react-native-shadow-2';

type Props = CompositeScreenProps<
  BottomTabScreenProps<BottomTabParamList, 'Search'>,
  StackScreenProps<RootStackParamList>
>;

const {width, height} = Dimensions.get('screen');

const Search = ({}: Props) => {
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
    }, []),
  );

  return (
    <View style={styles.containerWrapper}>
      <StatusBar translucent barStyle={'dark-content'} backgroundColor={'transparent'} animated={true} />
      <View style={styles.container}>
        <Shadow
          sides={{bottom: true, top: false, end: false, start: false}}
          style={styles.searchbarContainer}
          stretch
          distance={2.5}>
          <View>
            <View style={styles.searchbar}>
              <View style={{paddingHorizontal: 5}}>
                <SearchIcon size={15} color={COLORS.TEXT_GRAY} />
              </View>
              <TextInput style={styles.inputSearch} placeholder="Tìm kiếm bài hát, nghệ sĩ" />
            </View>
          </View>
        </Shadow>
      </View>
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  containerWrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  searchbarContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 13,
  },
  searchbar: {
    paddingHorizontal: 5,
    borderRadius: 20,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: COLORS.BACKGROUND_SECONDARY,
  },
  inputSearch: {
    flex: 1,
    lineHeight: 35,
    textAlignVertical: 'center',
    padding: 0,
  },
});
