import {StackScreenProps} from '@react-navigation/stack';
import React, {useEffect} from 'react';
import {
  ActivityIndicator,
  Button,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableNativeFeedback,
  Image,
} from 'react-native';
import {Shadow} from 'react-native-shadow-2';
import firestore from '@react-native-firebase/firestore';
import IonIcon from 'react-native-vector-icons/Ionicons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

import {MyPlaylistsStackParamList} from '..';
import GoogleFirebaseSigninButton from '../../../components/GoogleFirebaseSigninButton';
import {COLORS} from '../../../constants';
import {useAuth} from '../../../contexts/AuthContext';
import {MyPlaylist} from '../../../types';
import {CreatePlaylistModal} from './CreatePlaylistModal';

type Props = StackScreenProps<MyPlaylistsStackParamList, 'MainPage'>;

const MainPage: React.FC<Props> = ({navigation}) => {
  const {user} = useAuth();
  const [playlists, setPlaylists] = React.useState<MyPlaylist[]>([]);
  const [createPlaylistModalVisible, setCreatePlaylistModalVisible] = React.useState(true);

  useEffect(() => {
    if (!user) return;

    (async () => {
      const playlists = await firestore().collection('playlists').where('uid', '==', user.uid).get();
      const myPlaylists = playlists.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data(),
        } as MyPlaylist;
      });
      setPlaylists(myPlaylists);
    })();
  }, [user]);

  return (
    <View style={styles.containerWrapper}>
      <StatusBar translucent barStyle={'dark-content'} backgroundColor={'transparent'} animated={true} />
      <View style={styles.container}>
        <Shadow
          sides={{bottom: true, top: false, end: false, start: false}}
          style={styles.headerContainer}
          stretch
          distance={2.5}>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              padding: 5,
              justifyContent: 'space-between',
            }}>
            <Text style={{color: COLORS.TEXT_PRIMARY, fontSize: 25, fontWeight: '600'}}>Playlists</Text>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
              <Text style={{color: COLORS.TEXT_PRIMARY, fontSize: 16, fontWeight: '400'}}>
                {user?.displayName || 'Chưa đăng nhập'}
              </Text>
              <View
                style={{
                  borderRadius: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 30,
                  width: 30,
                  backgroundColor: '#cbd6e6',
                }}>
                <FontAwesomeIcon name="user" size={20} color="#eff2fa" style={{fontWeight: '200'}} />
              </View>
            </View>
          </View>
        </Shadow>

        {user ? (
          <View style={{paddingVertical: 15}}>
            <ScrollView contentContainerStyle={{paddingBottom: 20}}>
              <TouchableNativeFeedback
                background={TouchableNativeFeedback.Ripple(COLORS.RIPPLE_LIGHT, false)}
                onPress={() => {
                  setCreatePlaylistModalVisible(true);
                }}>
                <View
                  style={{
                    paddingHorizontal: 15,
                    paddingVertical: 7,
                    flexDirection: 'row',
                    gap: 10,
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      height: 45,
                      width: 45,
                      borderRadius: 7,
                      backgroundColor: COLORS.BACKGROUND_PLAYLIST,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <AntDesignIcon name="plus" size={25} color="#00000077" style={{fontWeight: '200'}} />
                  </View>
                  <View style={{marginRight: 'auto'}}>
                    <Text style={{color: COLORS.TEXT_PRIMARY, fontSize: 16}}>Tạo playlist mới</Text>
                  </View>
                </View>
              </TouchableNativeFeedback>

              {playlists.length < 1 ? (
                <ActivityIndicator size="large" color={COLORS.RED_PRIMARY} />
              ) : (
                playlists.map((playlist, index) => {
                  return (
                    <TouchableNativeFeedback
                      key={index}
                      background={TouchableNativeFeedback.Ripple(COLORS.RIPPLE_LIGHT, false)}
                      onPress={() => {
                        navigation.navigate('PlaylistPage', {playlist});
                      }}>
                      <View
                        style={{
                          paddingHorizontal: 15,
                          paddingVertical: 7,
                          flexDirection: 'row',
                          gap: 10,
                          alignItems: 'center',
                        }}>
                        <Image
                          source={require('../../../../assets/default_song_thumbnail.png')}
                          style={{width: 45, height: 45, borderRadius: 7}}
                        />
                        <View style={{marginRight: 'auto'}}>
                          <Text style={{color: COLORS.TEXT_PRIMARY, fontSize: 16}}>{playlist.name}</Text>
                        </View>
                        <TouchableNativeFeedback
                          hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
                          background={TouchableNativeFeedback.Ripple(COLORS.RIPPLE_LIGHT, true, 30)}
                          onPress={() => {
                            // setSelectedTrack(track);
                            // downloadedTrackBottomSheetRef.current?.present();
                          }}>
                          <View>
                            <IonIcon name="ios-ellipsis-vertical" size={20} color={COLORS.TEXT_GRAY} />
                          </View>
                        </TouchableNativeFeedback>
                      </View>
                    </TouchableNativeFeedback>
                  );
                })
              )}
            </ScrollView>
          </View>
        ) : (
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <GoogleFirebaseSigninButton />
          </View>
        )}
      </View>
      <CreatePlaylistModal
        visible={createPlaylistModalVisible}
        onDismiss={() => setCreatePlaylistModalVisible(false)}
        setPlaylists={setPlaylists}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  containerWrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 13,
  },
});

export default MainPage;
