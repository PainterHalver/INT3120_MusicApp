import {
  Button,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Platform,
  useColorScheme,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';

import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {StackScreenProps} from '@react-navigation/stack';
import {CompositeScreenProps, useFocusEffect} from '@react-navigation/native';
import BottomSheet, {BottomSheetBackdrop, BottomSheetModal} from '@gorhom/bottom-sheet';

import {BottomTabParamList} from '../../../App';
import {RootStackParamList} from '../../../App';

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

  // ref
  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = React.useMemo(() => ['50%', '90%'], []);

  // callbacks
  const handleSheetChanges = React.useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  return (
    <View style={styles.containerWrapper}>
      <StatusBar translucent barStyle={'dark-content'} backgroundColor={'transparent'} animated={true} />
      <View style={styles.container}>
        <Button title="Bottom Sheet" onPress={() => bottomSheetModalRef.current?.present()} />
      </View>
      <BottomSheetModal
        enablePanDownToClose
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backgroundStyle={{backgroundColor: 'cyan'}}
        style={{}}
        backdropComponent={props => (
          <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
        )}>
        <View>
          <Text>Awesome 🎉</Text>
        </View>
      </BottomSheetModal>
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
