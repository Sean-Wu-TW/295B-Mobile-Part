import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Button, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const Signup = ({ navigation }) => {

    const [userid, setUserid] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setpasswordConfirm] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [valid, setValid] = useState(false);

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

    const updateValidData = () => {
      setValid(userid.length && password.length ** passwordConfirm.length && password == passwordConfirm && name.length);
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
            await firestore()
            .collection('users')
            .doc(userid)
            .set({
              name: name,
              email: email,
              password: password,
              userid: userid,
            })
            .then(() => {
              console.log('User added!');
            });
            console.log('good');
            navigation.navigate('Login');
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
                onChangeText={name => {setName(name); updateValidData()}}
                style={styles.input}
            />
            <Text style={styles.title}>User ID:</Text>
            <TextInput
                maxLength={40}
                onChangeText={uid => {setUserid(uid); updateValidData()}}
                style={styles.input}
            />
            <Text style={styles.title}>Password:</Text>
            <TextInput
                maxLength={40}
                onChangeText={pwd => {setPassword(pwd);updateValidData()}}
                secureTextEntry={true}
                style={styles.input}
            />
            <Text style={styles.title}>Confirm Password:</Text>
            <TextInput
                maxLength={40}
                onChangeText={pwd => {setpasswordConfirm(pwd), updateValidData()}}
                secureTextEntry={true}
                style={styles.input}
            />
            <Text style={styles.title}>Email:</Text>
            <TextInput
                maxLength={40}
                onChangeText={email => {setEmail(email); updateValidData()}}
                style={styles.input}
            />
            <View style={styles.button}>
            <Button title="Sign up" onPress={handleSubmit} color="green" disabled={!valid}></Button> 
            </View>
            <Button title="Back to Login" onPress={() => navigation.navigate('Login')}></Button> 
            
        </View>
        </>
        )

}

const styles = StyleSheet.create({
    title: {
        fontSize: 20
    },
    input: {
      borderColor: 'black',
      borderRadius: 5,
      borderWidth: 1,
      marginTop: 5,
      marginBottom: 10
    },
    header: {
        fontSize: 28,
    },
    button: {
      marginTop: 10,
      marginBottom: 10
    }
})

export default Signup;