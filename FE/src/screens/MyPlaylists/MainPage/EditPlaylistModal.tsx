import {useState, useEffect, useRef} from 'react';
import {
  Modal,
  ModalProps,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Text,
  TextInput,
  TouchableNativeFeedback,
  ToastAndroid,
  Keyboard,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {COLORS} from '../../../constants';
import {useAuth} from '../../../contexts/AuthContext';
import {useLoadingModal} from '../../../contexts/LoadingModalContext';
import {MyPlaylist} from '../../../types';
import Animated, {
  WithSpringConfig,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {usePlaylist} from '../../../contexts/PlaylistContext';

interface Props {
  visible: boolean;
  onDismiss: () => void;
  selectedPlaylist: MyPlaylist;
}

const springOptions: WithSpringConfig = {
  overshootClamping: true,
  restSpeedThreshold: 0.1,
  restDisplacementThreshold: 0.1,
  damping: 20,
  mass: 0.5,
  stiffness: 100,
};

export const EditPlaylistMopdal = ({visible, onDismiss, selectedPlaylist}: Props) => {
  const {user} = useAuth();
  const {setPlaylists} = usePlaylist();
  const {setLoading} = useLoadingModal();
  const [playlistName, setPlaylistName] = useState<string>('');
  const inputRef = useRef<TextInput>(null);

  const updateSelectedPlaylist = async (newName: string) => {
    try {
      if (!user) return ToastAndroid.show('Chưa tìm thấy user', ToastAndroid.SHORT);

      setLoading(true);

      await firestore().collection('playlists').doc(selectedPlaylist.id).update({
        name: newName,
      });

      const updatedPlaylist = {...selectedPlaylist, name: newName};
      setPlaylists((prev: MyPlaylist[]) => {
        const newPlaylists = [...prev];
        const index = newPlaylists.findIndex(playlist => playlist.id === selectedPlaylist.id);
        newPlaylists[index] = updatedPlaylist;
        return newPlaylists;
      });

      ToastAndroid.show('Sửa playlist thành công', ToastAndroid.SHORT);
    } catch (error) {
      console.log(error);
      ToastAndroid.show('Đã có lỗi xảy ra', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!visible) setPlaylistName('');
    else {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [visible]);

  // ANIMATION
  const translateY = useSharedValue(0);

  const rTranslateY = useAnimatedStyle(() => {
    return {
      transform: [{translateY: translateY.value}],
    };
  });

  useEffect(() => {
    const kbShowListener = Keyboard.addListener('keyboardDidShow', () => {
      translateY.value = withSpring(-125, springOptions);
    });

    const kbHideListener = Keyboard.addListener('keyboardDidHide', () => {
      translateY.value = withSpring(0, springOptions);
    });

    return () => {
      kbShowListener.remove();
      kbHideListener.remove();
    };
  }, []);

  return (
    <Modal animationType="fade" transparent={true} visible={visible} statusBarTranslucent={true}>
      <TouchableWithoutFeedback onPress={onDismiss}>
        <View style={styles.modalBackground}>
          <TouchableWithoutFeedback>
            <Animated.View style={[styles.modal, rTranslateY]}>
              <Text style={{color: COLORS.TEXT_PRIMARY, fontSize: 20, fontWeight: '500'}}>
                Chỉnh sửa Playlist: {selectedPlaylist.name}
              </Text>
              <View>
                <TextInput
                  maxLength={30}
                  placeholder="Nhập tên của Playlist"
                  value={playlistName}
                  onChangeText={setPlaylistName}
                  ref={inputRef}
                  cursorColor={COLORS.RED_PRIMARY}
                  style={{
                    borderBottomColor: COLORS.RED_PRIMARY,
                    borderBottomWidth: 2,
                    padding: 0,
                    paddingBottom: 3,
                    fontSize: 16,
                  }}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  marginTop: 15,
                }}>
                <TouchableNativeFeedback onPress={onDismiss}>
                  <View style={{height: 35, justifyContent: 'center', paddingHorizontal: 10}}>
                    <Text style={{color: COLORS.RED_PRIMARY, fontSize: 15}}>BỎ QUA</Text>
                  </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback
                  disabled={playlistName.length < 1}
                  onPress={() => {
                    updateSelectedPlaylist(playlistName);
                    onDismiss();
                  }}>
                  <View style={{height: 35, justifyContent: 'center', paddingHorizontal: 10}}>
                    <Text
                      style={{
                        color: playlistName.length > 0 ? COLORS.RED_PRIMARY : COLORS.TEXT_GRAY,
                        fontSize: 15,
                      }}>
                      ĐỒNG Ý
                    </Text>
                  </View>
                </TouchableNativeFeedback>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modal: {
    width: '95%',
    backgroundColor: COLORS.BACKGROUND_PRIMARY,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    borderRadius: 10,
    gap: 12,
    elevation: 5,
  },
});
