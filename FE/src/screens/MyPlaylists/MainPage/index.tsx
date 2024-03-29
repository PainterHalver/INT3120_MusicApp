import {StackScreenProps} from '@react-navigation/stack';
import React from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
  Pressable,
} from 'react-native';
import {Shadow} from 'react-native-shadow-2';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {MyPlaylistsStackParamList} from '..';
import GoogleFirebaseSigninButton from '../../../components/GoogleFirebaseSigninButton';
import {COLORS} from '../../../constants';
import {useAuth} from '../../../contexts/AuthContext';
import {usePlaylist} from '../../../contexts/PlaylistContext';
import {MyPlaylist} from '../../../types';
import {CreatePlaylistModal} from './CreatePlaylistModal';
import {EditPlaylistMopdal as EditPlaylistModal} from './EditPlaylistModal';
import {PlaylistBottomSheet} from './PlaylistBottomSheet';
import {PlaylistItem} from './PlaylistItem';
import {ProfileIcon} from '../../../components/ProfileIcon';
import FocusAwareStatusBar from '../../../components/FocusAwareStatusBar';

type Props = StackScreenProps<MyPlaylistsStackParamList, 'MainPage'>;

const MainPage: React.FC<Props> = ({navigation}) => {
  const {user, signInWithGoogle} = useAuth();
  const {loadingPlaylists, playlists, sharedPlaylists} = usePlaylist();
  const [createPlaylistModalVisible, setCreatePlaylistModalVisible] = React.useState(false);
  const playlistBottomSheetRef = React.useRef<BottomSheetModal>(null);
  const [selectedPlaylist, setSelectedPlaylist] = React.useState<MyPlaylist>({
    name: 'Default Playlist',
    id: 'default',
    uid: 'default',
  });
  const [editPlaylistModalVisible, setEditPlaylistModalVisible] = React.useState(false);

  return (
    <View style={styles.containerWrapper}>
      <FocusAwareStatusBar translucent barStyle={'dark-content'} backgroundColor={'transparent'} />
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

            <Pressable
              onPress={() => {
                if (user) {
                  navigation.navigate('Profile');
                } else {
                  signInWithGoogle();
                }
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                <Text style={{color: COLORS.TEXT_PRIMARY, fontSize: 16, fontWeight: '400'}}>
                  {user?.displayName || 'Chưa đăng nhập'}
                </Text>
                <ProfileIcon size={30} />
              </View>
            </Pressable>
          </View>
        </Shadow>

        {user ? (
          <View style={{flex: 1}}>
            <ScrollView contentContainerStyle={{paddingVertical: 15}}>
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
                    <AntDesignIcon name="plus" size={25} color="#ffffff" style={{fontWeight: '200'}} />
                  </View>
                  <View style={{marginRight: 'auto'}}>
                    <Text style={{color: COLORS.TEXT_PRIMARY, fontSize: 16}}>Tạo playlist mới</Text>
                  </View>
                </View>
              </TouchableNativeFeedback>

              {loadingPlaylists ? (
                <ActivityIndicator size="large" color={COLORS.RED_PRIMARY} />
              ) : (
                <View>
                  {playlists.map((playlist, index) => {
                    return (
                      <TouchableNativeFeedback
                        key={index}
                        background={TouchableNativeFeedback.Ripple(COLORS.RIPPLE_LIGHT, false)}
                        onPress={() => {
                          navigation.navigate('PlaylistPage', {playlist});
                        }}>
                        <View>
                          <PlaylistItem
                            playlist={playlist}
                            setSelectedPlaylist={setSelectedPlaylist}
                            playlistBottomSheetRef={playlistBottomSheetRef}
                            isFavorite={index === 0}
                          />
                        </View>
                      </TouchableNativeFeedback>
                    );
                  })}
                  <Text style={{fontSize: 18, color: 'black', marginTop: 8, marginHorizontal: 16}}>
                    Playlist Được Chia Sẻ
                  </Text>
                  {sharedPlaylists.map((playlist, index) => {
                    return (
                      <TouchableNativeFeedback
                        key={index}
                        background={TouchableNativeFeedback.Ripple(COLORS.RIPPLE_LIGHT, false)}
                        onPress={() => {
                          navigation.navigate('PlaylistPage', {playlist});
                        }}>
                        <View>
                          <PlaylistItem
                            playlist={playlist}
                            setSelectedPlaylist={setSelectedPlaylist}
                            playlistBottomSheetRef={playlistBottomSheetRef}
                            isFavorite={index === 0}
                          />
                        </View>
                      </TouchableNativeFeedback>
                    );
                  })}
                </View>
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
      />
      <EditPlaylistModal
        visible={editPlaylistModalVisible}
        onDismiss={() => setEditPlaylistModalVisible(false)}
        selectedPlaylist={selectedPlaylist}
      />
      <PlaylistBottomSheet
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
