// @refresh reset

import React from 'react';
import {
  Button,
  Platform,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableNativeFeedback,
  View,
} from 'react-native';

import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps, useFocusEffect} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';

import {BottomTabParamList, RootStackParamList} from '../../../App';
import {PlayPauseLottieIcon} from '../Player/PlayPauseLottieIcon';
import {ZingMp3} from '../../zingmp3';
import axios from 'axios';
import {useLoadingModal} from '../../contexts/LoadingModalContext';

// Prop 1 là prop gần nhất, 2 là của parent
type Props = CompositeScreenProps<
  BottomTabScreenProps<BottomTabParamList, 'Hello'>,
  StackScreenProps<RootStackParamList>
>;

const Hello = ({navigation}: Props) => {
  React.useEffect(() => {
    (async () => {
      // const data = await axios.get('https://zingmp3.vn');
      // console.log(await ZingMp3.search('Thi'));
    })();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
    }, []),
  );

  const {setLoading} = useLoadingModal();

  const buttonHandler = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <View style={styles.containerWrapper}>
      <StatusBar translucent barStyle={'dark-content'} backgroundColor={'transparent'} animated={true} />
      <View style={styles.container}>
        <Button title="loading modal" onPress={buttonHandler} />
      </View>
      <TouchableNativeFeedback
        background={TouchableNativeFeedback.Ripple('#000', true, 500)}
        useForeground>
        <View style={{flex: 1, backgroundColor: 'red'}}>
          <PlayPauseLottieIcon />
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};

export default Hello;

const styles = StyleSheet.create({
  containerWrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    // backgroundColor: 'cyan',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
