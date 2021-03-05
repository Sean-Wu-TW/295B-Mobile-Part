import React, { useEffect, useState } from 'react';
import { View, TextInput, Text, Button, StyleSheet } from 'react-native';

const ChatMain = ({ navigation }) => {
  return (
    <>
    <Text> You're In main chat!</Text>
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