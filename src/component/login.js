import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Button, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const axios = require('axios');


const LoginForm = ({ setAuth, navigation }) => {
    const [userid, setUserid] = useState('');
    const [password, setpassword] = useState('');
    const LoginApi = async () => {
        try {
          const user = await firestore()
          .collection('users')
          .doc(userid)
          .get();

          if(user.exists && user.data().password === password){
            console.log(userid);
            console.log('good!');
            setAuth(userid);
          }else{
            Alert.alert(
              "Wrong Password",
              "Seems like you have entered the wrong password 🥲, please try again.",
              [
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel"
                },
                { text: "OK", 
                  onPress: () => console.log("OK Pressed")
                }
              ],
              { cancelable: false }
            );
          }
        } catch (error) {
          console.error(error);
        }
    }
    
    return (
        <>
        <View style={styles.main}>
            <Text style={styles.header}>
                Please Log in
            </Text>
            <Text style={styles.title}>User Id:</Text>
            <TextInput
                maxLength={40}
                onChangeText={setUserid}
                style={styles.inputText}
            />
            <Text style={styles.title}>Password:</Text>
            <TextInput
                maxLength={40}
                onChangeText={setpassword}
                secureTextEntry={true}
                style={styles.inputText}
            />
            <View style={styles.button}>
              <Button title="Log in" onPress={LoginApi} color="green"></Button>
            </View>
            <View style={styles.button}>
              <Button title="Sign up" onPress={() => navigation.navigate('Signup')}></Button>
            </View>
        </View>
        </>
    );
}

const styles = StyleSheet.create({
    title: {
      marginTop: 10,
      marginBottom: 5,
      fontSize: 20
    },
    header: {
        fontSize: 28,
    },
    inputText: {
      borderColor: 'black',
      borderRadius: 5,
      borderWidth: 1
    },
    button: {
      backgroundColor: 'red',
      marginTop: 10,
    }
})

export default LoginForm;