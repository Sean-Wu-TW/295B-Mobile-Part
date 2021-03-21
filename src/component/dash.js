import React, { useEffect, useState } from 'react';
import { View, TextInput, Text, Button, StyleSheet, StatusBar, SafeAreaView, FlatList, TouchableOpacity, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
navigator.geolocation = require('@react-native-community/geolocation');

const Dash = ({ setAuth, navigation, auth }) => {
  const [content, setContent] = useState('');
  const [field, setField] = useState('me');
  const [location, setLocation] = useState();
  const handleAuth = () => {
    setAuth(false);
  }

  const findCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const location = JSON.stringify(position);
        setLocation(location);
      },
      error => Alert.alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  useEffect(() => {
  }, [])
  return (
    <>
    <Text> You're In!</Text>
    <Text> You are {auth}</Text>
    <Button
        title="Go to addFriend"
        onPress={() => navigation.navigate('AddFriend')}
      />
    <Button title="Log Out" onPress={handleAuth}></Button>

    <TouchableOpacity onPress={findCoordinates}>
					<Text style={styles.welcome}>Find My Coords?</Text>
					<Text>Location: {location}</Text>
				</TouchableOpacity>
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