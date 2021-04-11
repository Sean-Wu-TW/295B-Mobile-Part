import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Button, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const Signup = ({ navigation }) => {

    const [userid, setUserid] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setpasswordConfirm] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const formAuth = () => {
        // if passwords does not match
        if( passwordConfirm !== password ){
            Alert.alert(
                "Please confirm password",
                "Passwords does not match",
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
        }else if(passwordConfirm === '' || password === '' || userid === '' || name === '' || email === ''){
            console.log(passwordConfirm);
            console.log(password);
            console.log(userid);
            console.log(name);
            console.log(email);
            Alert.alert(
                "Missing field",
                "",
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
        } else {
            return true;
        }
    }
    
    const handleSubmit = async () => {
        // check if user exists
        await firestore()
        .collection('users')
        .doc(userid)
        .get()
        .then(res => {
            if(res.exists){
                Alert.alert(
                    "User Exists",
                    "",
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
        });


        if(formAuth()){
            console.log('good');
        }else{
            console.log('bad');
        }


    }

    return (
        <>
        <View style={styles.main}>
            <Text style={styles.header}>
                Sign up
            </Text>
            <Text style={styles.title}>What's your name:</Text>
            <TextInput
                maxLength={40}
                onChangeText={setName}
            />
            <Text style={styles.title}>User Name:</Text>
            <TextInput
                maxLength={40}
                onChangeText={setUserid}
            />
            <Text style={styles.title}>Password:</Text>
            <TextInput
                maxLength={40}
                onChangeText={setPassword}
                secureTextEntry={true}
            />
            <Text style={styles.title}>Confirm Password:</Text>
            <TextInput
                maxLength={40}
                onChangeText={setpasswordConfirm}
                secureTextEntry={true}
            />
            <Text style={styles.title}>Email:</Text>
            <TextInput
                maxLength={40}
                onChangeText={setEmail}
            />
            
            <Button title="Sign up" onPress={handleSubmit}></Button> 
            <Button title="Back to Login" onPress={() => navigation.navigate('LoginForm')}></Button> 
            
        </View>
        </>
        )

}

const styles = StyleSheet.create({
    title: {
        fontSize: 20
    },
    header: {
        fontSize: 28,
    }
})

export default Signup;