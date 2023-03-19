import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

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

const NewApp = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

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

  const ItemAlbum = () => {
    return (
      <View style={{flexDirection: 'column'}}>
        <Image
          source={require('./../assets/Gnarls-Barkley-Crazy.jpg')}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: 80,
            width: 80,
            borderRadius: 10,
          }}
        />
        <Text>Ten Abulm</Text>
      </View>
    );
  };

  const ListenedRecently = () => {
    return (
      <View style={{flexDirection: 'column', paddingTop: 15}}>
        <View>
          <Text style={{fontSize: 25, color: 'black'}}>Nghe gần đây</Text>
        </View>
        <View style={{flexDirection: 'row', gap: 20, paddingBottom: 10}}>
          <ItemAlbum />
          <ItemAlbum />
          <ItemAlbum />
          <ItemAlbum />
        </View>
      </View>
    );
  };

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
          <ListenedRecently />
          <NewRelease />
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
