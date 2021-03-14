import React, { useEffect, useState } from 'react';
import { View, TextInput, Text, Button, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const ChatMain = ({ navigation, auth }) => {
  const [friendId, setFriendId] = useState('');
  console.log(auth);
  useEffect(() => {
    console.log(friendId);
  }, [friendId])

  const handleSubmit = async () => {

    // add doc to chat of mine
    await firestore()
    .collection('users')
    .doc(auth)
    .collection('chat')
    .doc(friendId)
    .set({
      name: friendId,
      lastChat: firestore.FieldValue.serverTimestamp(),
    })
    .then(() => {
      console.log('User chat added!');
    })
    .catch(console.error);


    // add message doc to chat of mine
    await firestore()
    .collection(`users/${auth}/chat/${friendId}/messages`)
    .add({
        text: `Hi! Let's chat!`,
        createdAt: firestore.FieldValue.serverTimestamp(),
        user: {
          _id: auth,
          avatar: 'https://placeimg.com/140/140/any',
          name: auth
        }
      })
    .then(() => {
      console.log('Chat -> messages added!');
    })
    .catch(console.error);


    // add doc to chat of him/hers
    await firestore()
    .collection('users')
    .doc(friendId)
    .collection('chat')
    .doc(auth)
    .set({
      name: auth,
      lastChat: firestore.FieldValue.serverTimestamp(),
    })
    .then(() => {
      console.log('User chat added!');
    })
    .catch(console.error);


    // add message doc to chat of him/hers
    await firestore()
    .collection(`users/${friendId}/chat/${auth}/messages`)
    .add({
        text: `Hi! Let's chat!`,
        createdAt: firestore.FieldValue.serverTimestamp(),
        user: {
          _id: auth,
          avatar: 'https://placeimg.com/140/140/any',
          name: auth
        }
      })
    .then(() => {
      console.log('Chat -> messages added!');
    })
    .catch(console.error);

    // update my friend list
    await firestore()
    .doc(`users/${auth}`)
    .update({
      friends: firestore.FieldValue.arrayUnion(friendId),
    })
    .then(() => {
      console.log('Friend list updated!')
    });


    // update other person friend list
    await firestore()
    .doc(`users/${friendId}`)
    .update({
      friends: firestore.FieldValue.arrayUnion(auth),
    })
    .then(() => {
      console.log('Friend list updated!')
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


export default ChatMain;