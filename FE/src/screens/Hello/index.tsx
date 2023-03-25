// @refresh reset

import React from 'react';
import {Button, Platform, StatusBar, StyleSheet, TouchableNativeFeedback, View} from 'react-native';

import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps, useFocusEffect} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import LotteView from 'lottie-react-native';

import {BottomTabParamList, RootStackParamList} from '../../../App';

// Prop 1 là prop gần nhất, 2 là của parent
type Props = CompositeScreenProps<
  BottomTabScreenProps<BottomTabParamList, 'Hello'>,
  StackScreenProps<RootStackParamList>
>;

const Hello = ({navigation}: Props) => {
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
    }, []),
  );

  const buttonRef = React.useRef<LotteView>(null);

  return (
    <View style={styles.containerWrapper}>
      <StatusBar translucent barStyle={'dark-content'} backgroundColor={'transparent'} animated={true} />
      <View style={styles.container}>
        <Button
          title="Bottom Sheet"
          onPress={() => {
            buttonRef.current?.play(33, 67);
          }}
        />
      </View>
      <TouchableNativeFeedback
        background={TouchableNativeFeedback.Ripple('#000', true, 500)}
        useForeground
        onPress={() => {
          buttonRef.current?.play(0, 33);
        }}>
        <View style={{flex: 1, backgroundColor: 'red'}}>
          <LotteView
            colorFilters={[
              {
                keypath: 'play',
                color: '#fff',
              },
              {
                keypath: 'pause',
                color: '#fff',
              },
            ]}
            ref={buttonRef}
            source={require('./../../icons/play_pause.json')}
            loop={false}
            speed={2}
          />
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
