import React, { useEffect, useState } from 'react';
import { View, TextInput, Text, Button, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const AddFriend = ({ navigation, auth }) => {
  const [friendId, setFriendId] = useState('');
  console.log(auth);
  useEffect(() => {
    console.log(friendId);
  }, [friendId])

  const handleSubmit = async () => {

    // search users list for user & extract info...
    const user = await firestore()
    .collection('users')
    .doc(friendId)
    .get();
    // console.log(user);
    // console.log(user.data().name);

    const me = await firestore()
    .collection('users')
    .doc(auth)
    .get();
    console.log(me);
    console.log(me.data().name);

    // update my friend list
    await firestore()
    .doc(`users/${auth}`)
    .update({
      friends: firestore.FieldValue.arrayUnion({
        avatar: user.data().avatar, 
        userId: user.data().userid, 
        userName: user.data().name}),
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
        userName: me.data().name}),
    })
    .then(() => {
      console.log('Friend list updated!(Friend)')
    });
  }

  return (
    <>
    <Text style={styles.title}>Add new friends by entering their userid:</Text>
    <TextInput
      maxLength={40}
      onChangeText={setFriendId}
    />


    <Button
        title="Add friend"
        onPress={handleSubmit}
      />
    <Button
        title="Go to Dash"
        onPress={() => navigation.navigate('Dash')}
      />
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


export default AddFriend;