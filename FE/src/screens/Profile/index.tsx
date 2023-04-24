import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Platform,
  TouchableOpacity,
  Image,
  TouchableNativeFeedback,
  Alert,
  ToastAndroid,
} from 'react-native';
import React from 'react';
import OctIcon from 'react-native-vector-icons/Octicons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {useAuth} from '../../contexts/AuthContext';
import {Shadow} from 'react-native-shadow-2';
import {COLORS} from '../../constants';
import {useNavigation} from '@react-navigation/native';
import {LogoutIcon} from '../../icons/LogoutIcon';
import {useLoadingModal} from '../../contexts/LoadingModalContext';

const IMAGE_SIZE = 55;

export const Profile = () => {
  const {setLoading} = useLoadingModal();
  const navigation = useNavigation();
  const {user, signOut} = useAuth();

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
              gap: 10,
              justifyContent: 'center',
              position: 'relative',
            }}>
            <View style={{position: 'absolute', left: 5, bottom: 5}}>
              <TouchableOpacity
                hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
                onPress={() => {
                  navigation.goBack();
                }}>
                <OctIcon name="arrow-left" size={28} color={COLORS.TEXT_PRIMARY} />
              </TouchableOpacity>
            </View>
            <Text style={{color: COLORS.TEXT_PRIMARY, fontSize: 25, fontWeight: '600'}}>Tài khoản</Text>
          </View>
        </Shadow>
        <View style={{flex: 1, paddingBottom: 15, paddingTop: 30}}>
          <View style={{alignItems: 'center', gap: 15, marginBottom: 15}}>
            {user?.photoURL ? (
              <Image
                source={{uri: user?.photoURL}}
                style={{height: IMAGE_SIZE, width: IMAGE_SIZE, borderRadius: 50}}
              />
            ) : (
              <View
                style={{
                  borderRadius: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: IMAGE_SIZE,
                  width: IMAGE_SIZE,
                  backgroundColor: '#cbd6e6',
                }}>
                <FontAwesomeIcon
                  name="user"
                  size={IMAGE_SIZE - 15}
                  color="#eff2fa"
                  style={{fontWeight: '200'}}
                />
              </View>
            )}
            <Text style={{fontSize: 21, fontWeight: '600', color: COLORS.TEXT_PRIMARY}}>
              {user?.displayName}
            </Text>
          </View>
          <View
            style={{
              borderBottomColor: '#50505055',
              borderBottomWidth: StyleSheet.hairlineWidth,
              marginHorizontal: 15,
            }}
          />
          <View style={{paddingVertical: 15}}>
            <TouchableNativeFeedback
              onPress={() => {
                Alert.alert('Đăng xuất', 'Bạn có chắc muốn xóa đăng xuất khỏi tài khoản này?', [
                  {
                    text: 'Hủy',
                    style: 'cancel',
                  },
                  {
                    text: 'Đăng xuất',
                    style: 'destructive',
                    onPress: async () => {
                      try {
                        setLoading(true);
                        await signOut();
                        navigation.goBack();
                      } catch (error) {
                        console.log(error);
                        ToastAndroid.show('Có lỗi xảy ra khi đăng xuất!', ToastAndroid.SHORT);
                      } finally {
                        setLoading(false);
                      }
                    },
                  },
                ]);
              }}>
              <View style={styles.option}>
                <LogoutIcon size={25} color={COLORS.TEXT_PRIMARY} />
                <Text style={styles.optionText}>Đăng xuất</Text>
              </View>
            </TouchableNativeFeedback>
          </View>
        </View>
      </View>
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
    paddingBottom: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 15,
  },
  optionText: {
    fontSize: 14.5,
    color: COLORS.TEXT_PRIMARY,
  },
});
