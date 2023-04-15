import {StackScreenProps} from '@react-navigation/stack';
import React from 'react';
import {Button, Platform, StatusBar, StyleSheet, Text, View} from 'react-native';
import {Shadow} from 'react-native-shadow-2';
import {MyPlaylistsStackParamList} from '..';
import GoogleFirebaseSigninButton from '../../../components/GoogleFirebaseSigninButton';
import {COLORS} from '../../../constants';
import {useAuth} from '../../../contexts/AuthContext';

type Props = StackScreenProps<MyPlaylistsStackParamList, 'MainPage'>;

const MainPage: React.FC<Props> = ({navigation}) => {
  const {user} = useAuth();

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
            <Text style={{color: COLORS.TEXT_PRIMARY, fontSize: 16, fontWeight: '400'}}>
              {user?.displayName || 'Chưa đăng nhập'}
            </Text>
          </View>
        </Shadow>

        {user ? (
          <View></View>
        ) : (
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <GoogleFirebaseSigninButton />
          </View>
        )}
        <Button
          title="to playlist"
          onPress={() => {
            navigation.navigate('PlaylistPage');
          }}
        />
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
    paddingBottom: 13,
  },
});

export default MainPage;
