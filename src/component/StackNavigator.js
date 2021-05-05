import React, { useState} from 'react';
import ChatBox from './ChatBox';
import MessagesScreen from './messagesScreen';
import { createStackNavigator } from '@react-navigation/stack';
import Dash from './dash';
import NearbyList from './NearbyList';
import AddFriend from './addFriend';
import LoginForm from './login';
import Signup from './Signup';
import ScoreScreen from './ScoreScreen';


const Stack = createStackNavigator();

const DashStackNavigator = ({auth, setAuth}) => {
  return (
    <Stack.Navigator initialRouteName="Dash">
      <Stack.Screen
          name="Dash"
          >
          {(props) => <Dash {...props} auth={auth} setAuth={setAuth}
          />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

const ChatStackNavigator = ({auth}) => {
    // console.log(auth);
    return (
      <Stack.Navigator initialRouteName="Dash">
        <Stack.Screen
            name="Chats"
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
            name="Nearby">
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
            name="Settings">
            {(props) => <AddFriend {...props} auth={auth} />}
        </Stack.Screen>

        <Stack.Screen
          name="ScoreScreen">
            {(props) => <ScoreScreen {...props} auth={auth} />}
        </Stack.Screen>
      </Stack.Navigator>
    );
}

const LoginStackNavigator = ({setAuth}) => {
  return (
      <Stack.Navigator initialRouteName="Login Screen">
        <Stack.Screen
          name="Login">
          {(props) => <LoginForm {...props} setAuth={setAuth} />}
        </Stack.Screen>
        <Stack.Screen
            name="Signup">
            {(props) => <Signup {...props} setAuth={setAuth} />}
        </Stack.Screen>
      </Stack.Navigator>
  );
}

export { DashStackNavigator, ChatStackNavigator, NearbyStackNavigator, SettingsStackNavigator, LoginStackNavigator};