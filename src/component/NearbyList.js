import React, { useEffect, useState } from 'react';
import { View, TextInput, Text, Button, StyleSheet, StatusBar, SafeAreaView, FlatList, TouchableOpacity, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import distance from '@turf/distance'


const NearbyList = ({auth}) => {

  const [friendList, setFriendList] = useState({});

  useEffect(() => {
    if (friendList) {
      calculateDistance();
    }
  }, [friendList]);

    const viewNearbyUsers = async() => {
        const users = await firestore()
          .collection('users')
          .doc(auth)
          .get()
          .then(querySnapshot => {
            setFriendList(querySnapshot.data().friends);
          });
          // console.log(users);
    }

    const calculateDistance = () => {
      console.log(friendList);
      for (const friend in friendList) {
        console.log(friendList[friend]);
        // const theFriend = await firestore()
        //   .collection('users')
        //   .doc(friendList[friend])
        //   .get()
      }
    }

    return (
        <>
        <Text> Nearby List</Text>
        <TouchableOpacity onPress={viewNearbyUsers}>
					<Text>Find My friends</Text>
				</TouchableOpacity>
        </>
      );
}

export default NearbyList;