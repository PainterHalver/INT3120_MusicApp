// @refresh reset

import React from 'react';
import {
  Button,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
} from 'react-native';

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, useFocusEffect } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';

import { BottomTabParamList, RootStackParamList } from '../../../App';
import { useAuth } from '../../contexts/AuthContext';
import { PlayPauseLottieIcon } from '../Player/PlayPauseLottieIcon';

// Prop 1 là prop gần nhất, 2 là của parent
type Props = CompositeScreenProps<
  BottomTabScreenProps<BottomTabParamList, 'Test'>,
  StackScreenProps<RootStackParamList>
>;

const Hello = ({navigation}: Props) => {
  const {user, signInWithGoogle, signOut} = useAuth();

  React.useEffect(() => {
    (async () => {})();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
    }, []),
  );

  const buttonHandler = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.log('BUTTON HANDLER:', error);
    }
  };

  return (
    <View style={styles.containerWrapper}>
      <StatusBar translucent barStyle={'dark-content'} backgroundColor={'transparent'} animated={true} />
      <View style={styles.container}>
        <Button title="Sign In" onPress={buttonHandler} />
      </View>
      <View style={styles.container}>
        <Button
          title="Sign Out"
          onPress={async () => {
            await signOut();
          }}
        />
      </View>
      <Text>{user?.displayName || ''}</Text>
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
