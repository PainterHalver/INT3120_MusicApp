import firestore from '@react-native-firebase/firestore';
import {StackScreenProps} from '@react-navigation/stack';
import React, {useEffect} from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import {Shadow} from 'react-native-shadow-2';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import {MyPlaylistsStackParamList} from '..';
import GoogleFirebaseSigninButton from '../../../components/GoogleFirebaseSigninButton';
import {COLORS} from '../../../constants';
import {useAuth} from '../../../contexts/AuthContext';
import {MyPlaylist} from '../../../types';
import {CreatePlaylistModal} from './CreatePlaylistModal';
import {MemoizedPlaylistItem} from './PlaylistItem';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {PlaylistBottomSheet} from './PlaylistBottomSheet';
import {EditPlaylistMopdal as EditPlaylistModal} from './EditPlaylistModal';

type Props = StackScreenProps<MyPlaylistsStackParamList, 'MainPage'>;

const MainPage: React.FC<Props> = ({navigation}) => {
  const {user} = useAuth();
  const [playlists, setPlaylists] = React.useState<MyPlaylist[]>([]);
  const [loadingPlaylists, setLoadingPlaylists] = React.useState<boolean>(true);
  const [createPlaylistModalVisible, setCreatePlaylistModalVisible] = React.useState(false);
  const playlistBottomSheetRef = React.useRef<BottomSheetModal>(null);
  const [selectedPlaylist, setSelectedPlaylist] = React.useState<MyPlaylist>({
    name: 'Default Playlist',
    id: 'default',
    uid: 'default',
  });
  const [editPlaylistModalVisible, setEditPlaylistModalVisible] = React.useState(false);

  useEffect(() => {
    if (!user) return;

    (async () => {
      try {
        setLoadingPlaylists(true);
        const playlists = await firestore().collection('playlists').where('uid', '==', user.uid).get();
        const myPlaylists = playlists.docs.map(doc => {
          return {
            id: doc.id,
            ...doc.data(),
          } as MyPlaylist;
        });
        setPlaylists(myPlaylists);
      } catch (error) {
        console.log(error);
        ToastAndroid.show('Có lỗi khi tải danh sách playlist', ToastAndroid.SHORT);
      } finally {
        setLoadingPlaylists(false);
      }
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

              {loadingPlaylists ? (
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
                      <View>
                        <MemoizedPlaylistItem
                          playlist={playlist}
                          setSelectedPlaylist={setSelectedPlaylist}
                          playlistBottomSheetRef={playlistBottomSheetRef}
                        />
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
      <EditPlaylistModal
        visible={editPlaylistModalVisible}
        onDismiss={() => setEditPlaylistModalVisible(false)}
        setPlaylists={setPlaylists}
        selectedPlaylist={selectedPlaylist}
      />
      <PlaylistBottomSheet
        setPlaylists={setPlaylists}
        selectedPlaylist={selectedPlaylist}
        ref={playlistBottomSheetRef}
        setEditPlaylistModalVisible={setEditPlaylistModalVisible}
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
