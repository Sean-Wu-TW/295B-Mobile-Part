import React, { useEffect, useState } from 'react';
import { View, TextInput, Text, Button, StyleSheet, StatusBar, SafeAreaView, FlatList, TouchableOpacity, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {getScore} from './services';
navigator.geolocation = require('@react-native-community/geolocation');

const ScoreScreen = ({ navigation, auth }) => {

    const [forgeryWins, setForgeryWins] = useState();
    const [forgeryLosses, setForgeryLosses] = useState();
    useEffect(() => {
        updateScore();
    }, [])
    const updateScore = () => {
        getScore({auth}).then(
            score => {
                setForgeryWins(score[0].Forgery_Win);
                setForgeryLosses(score[0].Forgery_Lose);
            }
        );
    }
    return (
        <>
    <View style={styles.cardItemContainer}>
      <View style={styles.scoreContainer}>
        <View>
          <Text style={styles.teamName}>Forgery Wins</Text>
        </View>
        <Text style={styles.teamScore}>{forgeryWins}</Text>
        <View>
          <Text style={styles.teamName}>Forgery Losses</Text>
        </View>
        <Text style={styles.teamScore}>{forgeryLosses}</Text>
      </View>
    </View>
    <TouchableOpacity 
                key='Explore'
                onPress={updateScore}
                style={[
                styles.button
                ]}>
                <Text
                style={[
                    styles.buttonLabel
                ]}>
                Update Score
                </Text>
            </TouchableOpacity>
        </>
    );
}
const styles = StyleSheet.create({
    cardItemContainer: {
      borderRadius: 8,
      borderColor: "black",
      borderWidth: 1,
      margin: 12,
      alignItems: "center"
    },
    scoreContainer: {
      margin: 3
    },
    teamName: {
      fontSize: 14,
      textAlign: "center"
    },
    teamScore: {
      fontSize: 24,
      textAlign: "center",
      fontWeight: "bold"
    },
    buttonLabel: {
        fontSize: 12,
        fontWeight: "500",
        color: "coral",
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
    }
  });

  
export default ScoreScreen;