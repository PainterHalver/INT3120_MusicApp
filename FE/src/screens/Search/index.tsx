import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps, useFocusEffect} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {Dimensions, Platform, Pressable, StatusBar, StyleSheet, TextInput, View} from 'react-native';
import Animated, {FadeIn} from 'react-native-reanimated';
import {Shadow} from 'react-native-shadow-2';
import {BottomTabParamList, RootStackParamList} from '../../../App';
import {COLORS} from '../../constants';
import {SearchIcon} from '../../icons/SearchIcon';
import {XCloseIcon} from '../../icons/XCloseIcon';
import HistoryView from './HistoryView';
import SearchView from './SearchView';
import FocusAwareStatusBar from '../../components/FocusAwareStatusBar';

type Props = CompositeScreenProps<
  BottomTabScreenProps<BottomTabParamList, 'Search'>,
  StackScreenProps<RootStackParamList>
>;

const {width, height} = Dimensions.get('screen');

const Search = ({route}: Props) => {
  const searchInputRef = React.useRef<TextInput>(null);
  useEffect(() => {
    if (route.params?.shouldFocusSearchBar) {
      console.log('FOCUSING SEARCHBAR');
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  });

  const [searchValue, setSearchValue] = useState<string>('');

  return (
    <Animated.View entering={FadeIn} style={styles.containerWrapper}>
      <FocusAwareStatusBar translucent barStyle={'dark-content'} backgroundColor={'transparent'} />
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
                ref={searchInputRef}
                style={styles.inputSearch}
                value={searchValue}
                onChangeText={newText => setSearchValue(newText)}
                placeholder="Tìm kiếm bài hát, nghệ sĩ..."
              />
              {searchValue && (
                <Pressable
                  onPress={() => setSearchValue('')}
                  hitSlop={{bottom: 10, top: 10, right: 10, left: 10}}>
                  <XCloseIcon size={18} color={COLORS.TEXT_GRAY} />
                </Pressable>
              )}
            </View>
          </View>
        </Shadow>
        <View style={styles.viewsContainer}>
          {searchValue.length > 0 ? <SearchView searchValue={searchValue} /> : <HistoryView />}
        </View>
      </View>
    </Animated.View>
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
    paddingLeft: 5,
    paddingRight: 7,
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
