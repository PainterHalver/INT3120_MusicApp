import React, {useState} from 'react';
import {Text, View} from 'react-native';
import {StyleSheet} from 'react-native';

function ListSongsItem() {
  //const [data, setData] = useState();
  return (
    <View style={styles.container}>
      <Text>React Native</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    padding: 50,
    backgroundColor: 'yellow',
  },
  title: {
    marginTop: 16,
    paddingVertical: 8,
    borderWidth: 4,
    borderColor: '#20232a',
    borderRadius: 6,
    backgroundColor: '#61dafb',
    color: '#20232a',
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
  },
});

export default ListSongsItem;
