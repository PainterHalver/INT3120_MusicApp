import React from 'react';
import BoxSearch from '../src/Components/BoxSearch';
import LineChart from '../src/Components/LineChart';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  useColorScheme,
  View,
  TextInput,
  Text,
  StyleSheet,
  Image,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import ListItem from '../src/Components/ListItem';

const NewApp = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const BannerHome = () => {
    return (
      <View>
        <View style={{justifyContent: 'center', flexDirection: 'row'}}>
          <Image
            source={require('./../assets/Thang-Tu-La-Loi-Noi-Doi-Cua-Em-Ha-Anh-Tuan.jpg')}
            style={{justifyContent: 'center', alignItems: 'center'}}
          />
        </View>
      </View>
    );
  };

  const dataRelease = [
    {description:'Ten album Hoa Minzy Duc Phuc Phuc du', image:'https://i.ytimg.com/vi/5e7e_KZINA4/maxresdefault.jpg'},
    {description:'Ten album', image:'https://i.ytimg.com/vi/5e7e_KZINA4/maxresdefault.jpg'},
    {description:'Ten album', image:'https://i.ytimg.com/vi/5e7e_KZINA4/maxresdefault.jpg'},
    {description:'Ten album', image:'https://i.ytimg.com/vi/5e7e_KZINA4/maxresdefault.jpg'},
    {description:'Ten album', image:'https://i.ytimg.com/vi/5e7e_KZINA4/maxresdefault.jpg'}

  ]

  const SongBox = () => {
    return (
      <View style={{flexDirection: 'row', gap: 10}}>
        <View>
          <Image
            source={require('./../assets/Gnarls-Barkley-Crazy.jpg')}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: 60,
              width: 60,
            }}
          />
        </View>
        <View style={{flexDirection: 'column'}}>
          <Text>Ten Bai Hat</Text>
          <Text>Ca si</Text>
          <Text>Ngay nao</Text>
        </View>
      </View>
    );
  };

  const NewRelease = () => {
    return (
      <View style={{flexDirection: 'column'}}>
        <View>
          <Text style={{fontSize: 25, color: 'black'}}>Moi pha hanh</Text>
        </View>
        <View style={{flexDirection: 'row', gap: 10}}>
          <Text style={[styles.chipButton, {backgroundColor: 'gray'}]}>
            Tat ca
          </Text>
          <Text style={styles.chipButton}>Viet Nam</Text>
          <Text style={styles.chipButton}>Quoc Te</Text>
        </View>
        <View style={{flexDirection: 'column', gap: 10, paddingTop: 10}}>
          <SongBox />
          <SongBox />
          <SongBox />
          <SongBox />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={[backgroundStyle, {marginTop: 50}]}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
            paddingHorizontal: 10,
          }}>
          <BoxSearch />
          <BannerHome />
          <ListItem data={dataRelease} name={'Nghệ sĩ thịnh hành'}/>
          <NewRelease />
          <ListItem data={dataRelease} name={'Lựa chọn hôm nay'}/>
          <LineChart/>
          <ListItem data={dataRelease} name={'Top 100'}/>
          <ListItem data={dataRelease} name={'Album hot >'}/>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NewApp;

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
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
