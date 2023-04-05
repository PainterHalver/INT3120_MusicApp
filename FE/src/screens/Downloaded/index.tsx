import React from 'react';
import {
  Button,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableNativeFeedback,
  View,
  Text,
} from 'react-native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps, useFocusEffect} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';

import {BottomTabParamList, RootStackParamList} from '../../../App';
import FileSystem from '../../filesystem';
import {PlayPauseLottieIcon} from '../Player/PlayPauseLottieIcon';
import {Shadow} from 'react-native-shadow-2';
import {COLORS} from '../../constants';

type Props = CompositeScreenProps<
  BottomTabScreenProps<BottomTabParamList, 'Downloaded'>,
  StackScreenProps<RootStackParamList>
>;

const Downloaded = ({navigation}: Props) => {
  React.useEffect(() => {
    (async () => {
      await FileSystem.getMusicFiles();
    })();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
    }, []),
  );

  return (
    <View style={styles.containerWrapper}>
      <StatusBar translucent barStyle={'dark-content'} backgroundColor={'transparent'} animated={true} />
      <View style={styles.container}>
        <Shadow
          sides={{bottom: true, top: false, end: false, start: false}}
          style={styles.headerContainer}
          stretch
          distance={2.5}>
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{color: COLORS.TEXT_PRIMARY, fontSize: 18, fontWeight: '500'}}>Đã tải</Text>
          </View>
        </Shadow>
      </View>
    </View>
  );
};

export default Downloaded;

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
