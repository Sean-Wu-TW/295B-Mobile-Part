import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Button, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const Signup = ({ navigation }) => {

    const [userid, setUserid] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setpasswordConfirm] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    return (
        <>
        <View style={styles.main}>
            <Text style={styles.header}>
                Sign up
            </Text>
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
                onChangeText={setPassword}
                secureTextEntry={true}
            />
            <Text style={styles.title}>Email:</Text>
            <TextInput
                maxLength={40}
                onChangeText={setEmail}
            />
            <Button title="Sign up" onPress={() => 

                // TODO: validate form data ...
                navigation.navigate('LoginForm')
                }></Button>
            
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