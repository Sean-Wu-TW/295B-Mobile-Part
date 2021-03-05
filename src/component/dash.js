import React, { useEffect, useState } from 'react';
import { View, TextInput, Text, Button, StyleSheet, StatusBar, SafeAreaView, FlatList } from 'react-native';
import firestore from '@react-native-firebase/firestore';


const Dash = ({ setAuth, navigation, auth }) => {
  const [content, setContent] = useState('');
  const [field, setField] = useState('me');
  const handleAuth = () => {
    setAuth(false);
  }
  return (
    <>
    <Text> You're In!</Text>
    <Text> You are {auth}</Text>
    <Button
        title="Go to ChatMain"
        onPress={() => navigation.navigate('ChatMain')}
      />
    <Button title="Log Out" onPress={handleAuth}></Button>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
      fontSize: 20
  },
  header: {
      fontSize: 28,
  },
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
})


export default Dash;