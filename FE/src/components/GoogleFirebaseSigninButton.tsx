import {StyleSheet, Text, TouchableNativeFeedback, View} from 'react-native';
import React from 'react';
import {COLORS} from '../constants';
import {useAuth} from '../contexts/AuthContext';

const GoogleFirebaseSigninButton = () => {
  const {signInWithGoogle} = useAuth();

  return (
    <View style={{borderRadius: 100, overflow: 'hidden'}}>
      <TouchableNativeFeedback onPress={signInWithGoogle}>
        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 15,
            backgroundColor: COLORS.RED_PRIMARY,
          }}>
          <Text style={{color: COLORS.TEXT_WHITE_PRIMARY, fontSize: 18}}>Đăng nhập bằng Google</Text>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};

export default GoogleFirebaseSigninButton;
