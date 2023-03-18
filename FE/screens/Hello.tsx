import {
  Button,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Platform,
} from 'react-native';
import React, {useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';

import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {StackScreenProps} from '@react-navigation/stack';
import {CompositeScreenProps} from '@react-navigation/native';

import {BottomTabParamList} from '../App';
import {RootStackParamList} from '../App';

// Prop 1 là prop gần nhất, 2 là của parent
type Props = CompositeScreenProps<
  BottomTabScreenProps<BottomTabParamList, 'Hello'>,
  StackScreenProps<RootStackParamList>
>;

const Hello = ({navigation}: Props) => {
  return (
    <View style={styles.containerWrapper}>
      <StatusBar
        translucent
        barStyle={'dark-content'}
        backgroundColor={'transparent'}
        animated={false}
      />
      <View style={styles.container}>
        <Button
          title="Open Player"
          onPress={() => {
            navigation.navigate('Player');
          }}
        />
      </View>
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
