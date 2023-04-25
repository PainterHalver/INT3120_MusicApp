import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import {useAuth} from '../contexts/AuthContext';

interface Props {
  size: number;
}

export const ProfileIcon: React.FC<Props> = ({size}) => {
  const {user} = useAuth();

  return (
    <View
      style={{
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        height: size,
        width: size,
        backgroundColor: '#cbd6e6',
      }}>
      {user?.photoURL ? (
        <Image source={{uri: user?.photoURL}} style={{height: size, width: size, borderRadius: 50}} />
      ) : (
        <FontAwesomeIcon name="user" size={size - 10} color="#eff2fa" style={{fontWeight: '200'}} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({});
