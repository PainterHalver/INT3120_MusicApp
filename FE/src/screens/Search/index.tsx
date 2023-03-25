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
import React, {useState} from 'react';
import {CompositeScreenProps, useFocusEffect} from '@react-navigation/native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {StackScreenProps} from '@react-navigation/stack';
import {BottomTabParamList, RootStackParamList} from '../../../App';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {Pressable} from 'react-native';
import {SearchIcon} from '../../icons/SearchIcon';
import {COLORS} from '../../constants';
import {Shadow} from 'react-native-shadow-2';
import SearchView from './SearchView';
import HistoryView from './HistoryView';

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

  const [searchValue, setSearchValue] = useState<string>('');

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
              <View style={{paddingHorizontal: 10}}>
                <SearchIcon size={14} color={COLORS.TEXT_GRAY} />
              </View>
              <TextInput
                style={styles.inputSearch}
                value={searchValue}
                onChangeText={newText => setSearchValue(newText)}
                placeholder="Tìm kiếm bài hát, nghệ sĩ..."
              />
            </View>
          </View>
        </Shadow>
        <View style={styles.viewsContainer}>
          {searchValue.length > 0 ? <SearchView searchValue={searchValue} /> : <HistoryView />}
        </View>
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
    textAlignVertical: 'center',
    padding: 0,
  },
  viewsContainer: {
    flex: 1,
    // backgroundColor: 'cyan',
  },
});
