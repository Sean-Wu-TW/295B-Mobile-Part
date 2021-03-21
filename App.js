/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import AddFriend from './src/component/addFriend';
import LoginForm from './src/component/login';
import Dash from './src/component/dash';
import Example from './src/component/ChatBox';
import useToken from './src/auth/useToken';
import MessagesScreen from './src/component/messagesScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// import database from '@react-native-firebase/database';



const App: () => React$Node = () => {
  const [auth, setAuth] = useToken('');

  const Stack = createStackNavigator();

  return (
    <>
      {auth ?       
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Dash">
          <Stack.Screen name="AddFriend" >   
            {props => <AddFriend {...props} auth={auth}/>}
          </Stack.Screen>
          <Stack.Screen name="Dash" >   
            {props => 
            <>
            <MessagesScreen {...props} auth={auth}/> 
            <Dash {...props} setAuth={setAuth} auth={auth} /> 
            </> }
          </Stack.Screen>
          <Stack.Screen 
            name="Example" 
            component={Example}
            options={({route}) => ({
              title: route.params.userName,
              headerBackTitleVisible: false,
            })} 
          >   
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
       : <LoginForm setAuth={setAuth}/>}
    </>
  );
};

const styles = StyleSheet.create({
  main: {
    alignContent: 'center',
  },
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
