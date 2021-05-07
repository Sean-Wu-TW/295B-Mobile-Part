import React, { useEffect, useState } from 'react';
import { View, TextInput, Text, Button, StyleSheet, StatusBar, SafeAreaView, FlatList, TouchableOpacity, Alert } from 'react-native';


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
    <View style={styles.bottom}>
    <Button
        title="Add friend"
        onPress={() => navigation.navigate('AddFriend')}
      />
    <Button
        title="Go to Score"
        onPress={() => navigation.navigate('ScoreScreen')}
        color="green"
      />
    <Button title="Log Out" onPress={handleAuth} color="red"/>
    </View>
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
  bottom: {
    flex: 1,
    justifyContent:  'flex-end'
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