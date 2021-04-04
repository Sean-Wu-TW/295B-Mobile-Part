import React, { useState} from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NearbyList from './NearbyList';

const Stack = createStackNavigator();

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

export { NearbyStackNavigator };