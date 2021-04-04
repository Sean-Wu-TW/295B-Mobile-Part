import React, { useEffect, useState } from 'react';
import { View, TextInput, Text, Button, StyleSheet, StatusBar, SafeAreaView, FlatList, TouchableOpacity, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { Toolbar, ToolbarBackAction, ToolbarContent, ToolbarAction } from 'react-native-paper';
navigator.geolocation = require('@react-native-community/geolocation');
const geofire = require('geofire-common');

const NearbyList = ({auth}) => {
  // const [theCenter, setTheCenter] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [location, setLocation] = useState({});

  useEffect(() => {
    if (location.latitude) {
        saveUserLocation();
    }
  }, [location]);

  // get the current user's location
  const findCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        // const location = JSON.stringify(position);        
        setLocation({latitude: position['coords']['latitude'], longitude: position['coords']['longitude']});
      },
      error => Alert.alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  const saveUserLocation = async() => {
    const hash = geofire.geohashForLocation([location.latitude, location.longitude]);
    // const newLocation = {
    //   geohash: hash,
    //   latitude: location.latitude,
    //   longitude: location.longitude
    // }
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
    // Find nearby users within 5km of the current user location
    const center = [location.latitude, location.longitude];
    const radiusInM = 5 * 1000;

    // Each item in 'bounds' represents a startAt/endAt pair. We have to issue
    // a separate query for each pair. There can be up to 9 pairs of bounds
    // depending on overlap, but in most cases there are 4.
    const bounds = geofire.geohashQueryBounds(center, radiusInM);
    const promises = [];
    for (const b of bounds) {
      const q = await firestore()
        .collection('users')
        .orderBy('geohash')
        .startAt(b[0])
        .endAt(b[1]);
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
      // reset markers
      setMarkers([]);
      matchingDocs.map((matchingDoc, index) => {
        if (matchingDoc['_data']['userid'] !== auth) {
          setMarkers([...markers, 
            {
              latlng: {
                latitude: matchingDoc['_data']['latitude'],
                longitude: matchingDoc['_data']['longitude']
              },
              title: matchingDoc['_data']['name']
            }]
          );
        }
      });
      // Process the matching documents
      // ...
    });
  }


  return (
      <>
      <View style={{
        flex: 1,
        backgroundColor: '#d02860'
      }}>

        <TouchableOpacity 
          key='Explore'
          onPress={findCoordinates}
          style={[
            styles.button
            // selectedValue === value && styles.selected,
          ]}>
          <Text
            style={[
              styles.buttonLabel
              // selectedValue === value && styles.selectedLabel,
            ]}>
            Explore
          </Text>
        </TouchableOpacity>
        

        <TouchableOpacity onPress={getCurrentLocation}>
          <Text>get my location</Text>
        </TouchableOpacity>
      </View>

      <View style={{
        flex: 10
      }}>
        <MapView
          initialRegion={{
            latitude: 37.421998333333335,
            longitude: -122.08400000000002,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          style={StyleSheet.absoluteFillObject}
          provider={MapView.PROVIDER_GOOGLE}
          showsUserLocation={true}
          toolbarEnabled={true}
          zoomControlEnabled={true}
        >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.latlng}
            title={marker.title}
          />
          ))}
        </MapView>
      </View>
      </>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 8,
    backgroundColor: "aliceblue",
  },
  box: {
    width: 50,
    height: 50,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  button: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: "oldlace",
    alignSelf: "flex-start",
    marginHorizontal: "1%",
    marginBottom: 6,
    minWidth: "48%",
    textAlign: "center",
  },
  selected: {
    backgroundColor: "coral",
    borderWidth: 0,
  },
  buttonLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "coral",
  },
  selectedLabel: {
    color: "white",
  },
  label: {
    textAlign: "center",
    marginBottom: 10,
    fontSize: 24,
  },
});

export default NearbyList;