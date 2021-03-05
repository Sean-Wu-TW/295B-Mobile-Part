import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Button, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const axios = require('axios');


const LoginForm = ({ setAuth }) => {
    const [userid, setUserid] = useState('');
    const [password, setpassword] = useState('');
    const LoginApi = async () => {
        try {
          const user = await firestore()
          .collection('users')
          .doc(userid)
          .get();

          if(user.exists && user.data().password === password){
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
            <Text style={styles.title}>User Name:</Text>
            <TextInput
                maxLength={40}
                onChangeText={setUserid}
            />
            <Text style={styles.title}>Password:</Text>
            <TextInput
                maxLength={40}
                onChangeText={setpassword}
                secureTextEntry={true}
            />
            <Button title="Log in" onPress={LoginApi}></Button>
        </View>
        </>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 20
    },
    header: {
        fontSize: 28,
    }
})

export default LoginForm;