import React, { useState} from 'react';
import ChatBox from './ChatBox';
import MessagesScreen from './messagesScreen';
import { createStackNavigator } from '@react-navigation/stack';
import Dash from './dash';
import NearbyList from './NearbyList';
import AddFriend from './addFriend';


const Stack = createStackNavigator();

const DashStackNavigator = ({auth, setAuth}) => {
  return (
    <Stack.Navigator initialRouteName="Dash">
      <Stack.Screen
          name="Dash Screen"
          >
          {(props) => <Dash {...props} auth={auth} setAuth={setAuth}
          />}
      </Stack.Screen>
      <Stack.Screen
          name="Example"
          component={Example}
          options={({route}) => ({
             title: route.params.userName,
             headerBackTitleVisible: false,
           })}>
      </Stack.Screen>
    </Stack.Navigator>
  );
}

const ChatStackNavigator = ({auth}) => {
    // console.log(auth);
    return (
      <Stack.Navigator initialRouteName="Dash">
        <Stack.Screen
            name="Hello"
            >
            {(props) => <MessagesScreen {...props} auth={auth} />}
        </Stack.Screen>
        <Stack.Screen
          name="ChatBox"
          component={ChatBox}
          options={({route}) => ({
             title: route.params.userName,
             headerBackTitleVisible: false,
           })}>
        </Stack.Screen>
      </Stack.Navigator>
    );
}

const NearbyStackNavigator = ({auth}) => {
  // console.log(auth)
  return (
      <Stack.Navigator initialRouteName="Nearby Screen">
        <Stack.Screen
            name="Nearby Screen">
            {(props) => <NearbyList {...props} auth={auth} />}
        </Stack.Screen>
      </Stack.Navigator>
    );
}

const SettingsStackNavigator = ({auth}) => {
  // console.log(auth)
  return (
      <Stack.Navigator initialRouteName="Settings Screen">
        <Stack.Screen
            name="Settings Screen">
            {(props) => <AddFriend {...props} auth={auth} />}
        </Stack.Screen>
      </Stack.Navigator>
    );
}

export { DashStackNavigator, ChatStackNavigator, NearbyStackNavigator, SettingsStackNavigator};