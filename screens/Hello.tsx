import {Button, StatusBar, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import {RootStackParamList} from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Hello'>;

const Hello = ({navigation}: Props) => {
  return (
    <SafeAreaView style={styles.containerWrapper}>
      <StatusBar barStyle={'default'} />
      <View style={styles.container}>
        <Text>Hello</Text>
        <Button
          title="NewApp Screen"
          onPress={() => {
            console.log('Button pressed');
            navigation.navigate('Welcome');
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Hello;

const styles = StyleSheet.create({
  containerWrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'cyan',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
