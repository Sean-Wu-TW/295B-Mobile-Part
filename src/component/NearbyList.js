import React, { useEffect, useState } from 'react';
import { View, TextInput, Text, Button, StyleSheet, StatusBar, SafeAreaView, FlatList, TouchableOpacity, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import MapView from 'react-native-maps';
import { Marker, Callout} from 'react-native-maps';
import { Toolbar, ToolbarBackAction, ToolbarContent, ToolbarAction } from 'react-native-paper';
import Slider from '@react-native-community/slider'; 
import AddFriend from './addFriend'

navigator.geolocation = require('@react-native-community/geolocation');
const geofire = require('geofire-common');

const NearbyList = ({auth}) => {
    // const [theCenter, setTheCenter] = useState([]);
    const [markers, setMarkers] = useState([]);
    const [location, setLocation] = useState({});
    const [distance, setDistance] = useState(10);
    const [friendId, setFriendId] = useState('');

    useEffect(() => {
    if (location.latitude) {
        saveUserLocation();
        exploreNearby();
    }
    }, [location]);

    useEffect(() => {
        if (friendId) {
            handleSubmit();
        }
    }, [friendId])

    const saveUserLocation = async() => {
        const hash = geofire.geohashForLocation([location.latitude, location.longitude]);
        // for test
        // const hash = geofire.geohashForLocation([37.231998333333335, -122.23100000000002]);
        const users = await firestore()
            .collection('users')
            .doc(auth)
            .update({
            geohash: hash,
            latitude: location.latitude,
            longitude: location.longitude
            //For test
            // latitude: 37.231998333333335,
            // longitude: -122.23100000000002
            });
    }

    const exploreNearby = async() => {

    // Find nearby users within 5km of the current user location
    const center = [location.latitude, location.longitude];
    const radiusInM = distance * 1000;
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
        // setMarkers([]);
        const markersArray = [];
        matchingDocs.map((matchingDoc, index) => {
        if (matchingDoc['_data']['userid'] !== auth) {

          markersArray.push({
            latlng: {
            latitude: matchingDoc['_data']['latitude'],
            longitude: matchingDoc['_data']['longitude']
            },
            title: matchingDoc['_data']['name'],
            userId: matchingDoc['_data']['userid']
        });
          // setMarkers([...markers, 
          //   {
          //       latlng: {
          //       latitude: matchingDoc['_data']['latitude'],
          //       longitude: matchingDoc['_data']['longitude']
          //       },
          //       title: matchingDoc['_data']['name'],
          //       userId: matchingDoc['_data']['userid']
          //   }]
          //   );
        }
        });
        // Process the matching documents
        // ...
        return markersArray;
    }).then((markersArray)=>{setMarkers(markersArray)})
    }

    // get the current user's location
    const findCoordinates = () => {
        navigator.geolocation.getCurrentPosition(
          position => {
            const location = JSON.stringify(position);        
            setLocation({latitude: position['coords']['latitude'], longitude: position['coords']['longitude']});
            // for test
            // setLocation({latitude: 37.231998333333335, longitude: -122.23100000000002});
          },
          error => Alert.alert(error.message),
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
      };

    const handleSliderChange = (distance) => {
        setDistance(distance);
    }

    const clearMarkers = () => {
        setMarkers([]);
    }

    const handleSubmit = async (userid) => {
        try {
          // search users list for user & extract info...
          const user = await firestore()
            .collection('users')
            .doc(friendId)
            .get();
    
          // case if user does not exist
          if (!user.exists) {
            Alert.alert(
              "User does not exist",
              "",
              [
                {
                  text: "Cancel",
                  onPress: () => { },
                  style: "cancel"
                },
                {
                  text: "OK",
                  onPress: () => { }
                }
              ],
              { cancelable: false }
            );
            return 
          }
    
          const me = await firestore()
            .collection('users')
            .doc(auth)
            .get();
    
          // update my friend list
          await firestore()
            .doc(`users/${auth}`)
            .update({
              friends: firestore.FieldValue.arrayUnion({
                avatar: user.data().avatar,
                userId: user.data().userid,
                userName: user.data().name
              }),
            })
            .then(() => {
              console.log('Friend list updated!')
            });
    
    
          // update other person friend list
          await firestore()
            .doc(`users/${friendId}`)
            .update({
              friends: firestore.FieldValue.arrayUnion({
                avatar: me.data().avatar,
                userId: me.data().userid,
                userName: me.data().name
              }),
            })
            .then(() => {
              console.log('Friend list updated!(Friend)')
            });    
        } catch (e) {
          console.log(e);
        }
      }

      const updateFriendId = async(userId) => {
        const friendList = await firestore()
        .collection('users')
        .doc(auth)
        .get();
        // .get('friends');
        let flag = true;
        for (let i = 0; i < friendList['_data']['friends'].length; i++) {
          if (userId === friendList['_data']['friends'][i]['userId']) {
            flag = false;
          }
        }
        console.log(flag);
        if (flag) {
          setFriendId(userId);
        }
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

            <TouchableOpacity 
                key='Clear'
                onPress={clearMarkers}
                style={[
                styles.button
                // selectedValue === value && styles.selected,
                ]}>
                <Text
                style={[
                    styles.buttonLabel
                    // selectedValue === value && styles.selectedLabel,
                ]}>
                Clear
                </Text>
            </TouchableOpacity>

            <Slider
                style={{width: 320, height: 40}}
                value={distance}
                minimumValue={5}
                maximumValue={30}
                step={5}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="#000000"
                onValueChange={(distance) => handleSliderChange(distance)}
                />
            <View style={styles.textCon}>
                <Text style={styles.colorGrey}>5 km</Text>
                <Text style={styles.colorYellow}>
                    {distance + 'km'}
                </Text>
                <Text style={styles.colorGrey}>30 km</Text>
            </View>
        </View>

        <View style={{
        flex: 2
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
            zoomControlEnabled={true}
        >
        {   markers.map((marker, index) => (
            <Marker
            key={index}
            coordinate={marker.latlng}
            icon={require('../img/marker.png')}
            title={marker.title}
            description={'Click to add as friend'}
            onCalloutPress={() => {updateFriendId(marker.userId)}}
            // onPress={ (e) => updateFriendId(marker.userId)}
            >
                <Callout>
                    <View style={styles.bubble}>
                        <Text style={styles.name}>{marker.title}</Text>
                        <Text>Add as friend</Text>
                        {/* <TouchableOpacity 
                            key='add'
                            onPress={ () => {alert('alert')}} 
                            style={[
                            styles.button
                        ]}>
                            <Text
                                style={[
                                styles.buttonLabel
                            ]}>
                                Add Friend
                            </Text>
                        </TouchableOpacity> */}
                        {/* <Button
                        title='add'
                        onPress={ () => {alert('alert')} } >
                            Add
                        </Button> */}
                    </View>
                </Callout>
            </Marker>
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
    bubble: {
        flexDirection: 'column',
        alignSelf: 'flex-start',
        backgroundColor: '#fff',
        borderRadius: 6,
        borderColor: '#ccc',
        borderWidth: 0.5,
        padding: 15,
        width: 150,
    },
    name: {
        fontSize: 26,
        marginBottom: 5,
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
    textCon: {
        width: 320,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    colorGrey: {
        color: '#d3d3d3'
    },
    colorYellow: {
        color: 'rgb(252, 228, 149)'
    }
});

export default NearbyList;