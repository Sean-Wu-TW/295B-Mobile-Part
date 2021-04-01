import React, { useEffect, useState } from 'react';
import { View, TextInput, Text, Button, StyleSheet, StatusBar, SafeAreaView, FlatList, TouchableOpacity, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import distance from '@turf/distance'
navigator.geolocation = require('@react-native-community/geolocation');

const geofire = require('geofire-common');

const NearbyList = ({auth}) => {

  const [theCenter, setTheCenter] = useState([]);

  // useEffect(() => {
  //   if (friendList) {
  //     calculateDistance();
  //   }
  // }, [friendList]);

  //   const viewNearbyUsers = async() => {
  //       const users = await firestore()
  //         .collection('users')
  //         .doc(auth)
  //         .get()
  //         .then(querySnapshot => {
  //           setFriendList(querySnapshot.data().friends);
  //         });
  //         // console.log(users);
  //   }

  //   const calculateDistance = () => {
  //     console.log(friendList);
  //     for (const friend in friendList) {
  //       console.log(friendList[friend]);
  //       // const theFriend = await firestore()
  //       //   .collection('users')
  //       //   .doc(friendList[friend])
  //       //   .get()
  //     }
  //   }


  const [location, setLocation] = useState({});

  useEffect(() => {
    if (location.latitude) {
        saveUserLocation();
    }
  }, [location]);

  const findCoordinates = () => {
    // console.log(auth);
    navigator.geolocation.getCurrentPosition(
      position => {
        // const location = JSON.stringify(position);
        // console.log(position['coords']);
        
        setLocation({longitude: 1, latitude: 2});

        // console.log(location.latitude);
      },
      error => Alert.alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  const saveUserLocation = async() => {
    const hash = geofire.geohashForLocation([location.latitude, location.longitude]);
    console.log(hash);
    const newLocation = {
      geohash: hash,
      latitude: location.latitude,
      longitude: location.longitude
    }
    const users = await firestore()
      .collection('users')
      .doc(auth)
      .update({
        geohash: hash,
        latitude: location.latitude,
        longitude: location.longitude
      });
  }

  const getCurrentLocation = async() => {
    const center = [location.latitude, location.longitude];
    const radiusInM = 1 * 1000;
    const bounds = geofire.geohashQueryBounds(center, radiusInM);
    const promises = [];
    for (const b of bounds) {
      const q = await firestore()
        .collection('users')
        .orderBy('geohash')
        .startAt(b[0])
        .endAt(b[1]);
    // console.log(q.get());
      promises.push(q.get());
    }

    Promise.all(promises).then((snapshots) => {
      const matchingDocs = [];
    
      for (const snap of snapshots) {
        for (const doc of snap.docs) {
          const lat = doc.get('latitude');
          const lng = doc.get('longitude');
    
          // We have to filter out a few false positives due to GeoHash
          // accuracy, but most will match
          const distanceInKm = geofire.distanceBetween([lat, lng], center);
          const distanceInM = distanceInKm * 1000;
          if (distanceInM <= radiusInM) {
            matchingDocs.push(doc);
          }
        }
      }
    
      return matchingDocs;
    }).then((matchingDocs) => {
      console.log(matchingDocs);
      // Process the matching documents
      // ...
    });
  }


  return (
      <>
      <Text> Nearby List</Text>

      <TouchableOpacity onPress={findCoordinates}>
        <Text>find my coor</Text>
      </TouchableOpacity>
      

      <TouchableOpacity onPress={getCurrentLocation}>
        <Text>get my location</Text>
      </TouchableOpacity>
      </>
    );
    
}

export default NearbyList;