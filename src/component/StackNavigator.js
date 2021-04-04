import React, { useState} from 'react';
import Example from './ChatBox';
import MessagesScreen from './messagesScreen';
import { createStackNavigator } from '@react-navigation/stack';
import NearbyList from './NearbyList';

const Stack = createStackNavigator();

const StackNavigator2 = ({auth}) => {
    console.log(auth);
    return (
      <Stack.Navigator initialRouteName="Dash">
        <Stack.Screen
            name="Hello"
            >
            {(props) => <MessagesScreen {...props} auth={auth} />}
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

const NearbyStackNavigator = ({auth}) => {
    console.log(auth)
    return (
        <Stack.Navigator initialRouteName="Nearby Screen">
          <Stack.Screen
              name="Nearby Screen">
              {(props) => <NearbyList {...props} auth={auth} />}
          </Stack.Screen>
        </Stack.Navigator>
      );
}

export { StackNavigator2, NearbyStackNavigator };