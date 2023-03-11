import {Button, StatusBar, StyleSheet, Text, View} from 'react-native';
import React from 'react';
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
    <SafeAreaView style={styles.containerWrapper}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'cyan'} />
      <View style={styles.container}>
        <Text>Hello</Text>
        <Button
          title="Open Player"
          onPress={() => {
            navigation.navigate('Player');
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
