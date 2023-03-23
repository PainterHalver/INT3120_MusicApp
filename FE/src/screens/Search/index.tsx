import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  Dimensions,
  View,
  TouchableHighlight,
} from 'react-native';
import React from 'react';
import {CompositeScreenProps} from '@react-navigation/native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {StackScreenProps} from '@react-navigation/stack';
import {BottomTabParamList, RootStackParamList} from '../../../App';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {Pressable} from 'react-native';

type Props = CompositeScreenProps<
  BottomTabScreenProps<BottomTabParamList, 'Search'>,
  StackScreenProps<RootStackParamList>
>;

const {width, height} = Dimensions.get('screen');

const categories = [
  'Podcasts',
  'Live Events',
  'New Releases',
  'Nhạc Việt',
  'Pop',
  'K-Pop',
  'Hip Hop',
  'Charts',
  'EQUAL',
  'GLOW',
  'RADAR',
  'Mood',
  'Rock',
  'R&B',
  'Country',
  'EDM',
  'Dance',
  'Latin',
  'Classical',
  'Jazz',
  'Chill',
  'Sleep',
  'Rap Việt',
];

const Search = ({}: Props) => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={styles.containerWrapper}>
      <StatusBar
        translucent
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={'transparent'}
        animated={false}
      />
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={{fontSize: 25, fontWeight: '600', color: '#000'}}>Tìm kiếm</Text>
        </View>
        <View style={styles.searchbarContainer}>
          <Pressable onPress={() => {}} android_ripple={{color: 'yellow'}} style={styles.bar}>
            <FeatherIcon name="search" size={25} color={'#000'} />
            <Text style={{fontSize: 17, color: '#000', marginLeft: 10}}>Hôm nay bạn muốn nghe gì?</Text>
          </Pressable>
        </View>
        <View style={styles.categoryContainer}>
          <Text style={{fontSize: 16, fontWeight: '600', color: '#000'}}>Tất cả danh mục</Text>
          <View style={styles.categories}></View>
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
  titleContainer: {
    height: 50,
    // backgroundColor: 'red',
    justifyContent: 'flex-end',
    paddingHorizontal: 15,
  },
  searchbarContainer: {
    height: 70,
    // backgroundColor: 'cyan',
    justifyContent: 'flex-end',
    paddingHorizontal: 15,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    paddingVertical: 13,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  categoryContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'orangered',
    alignItems: 'flex-start',
  },
  categories: {
    backgroundColor: 'yellow',
  },
});
