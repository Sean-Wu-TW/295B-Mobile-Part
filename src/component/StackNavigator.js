import React, { useState} from 'react';
import Example from './ChatBox';
import MessagesScreen from './messagesScreen';
import { createStackNavigator } from '@react-navigation/stack';
import NearbyList from './NearbyList';

const Stack = createStackNavigator();


// const StackNavigator = ({auth, setAuth}) => {
//     return (
//       <Stack.Navigator initialRouteName="Dash">
//         <Stack.Screen name="AddFriend">
//           {(props) => <AddFriend {...props} auth={auth} />}
//         </Stack.Screen>
//         <Stack.Screen name="Dash">
//           {(props) => (
//             <>
//               <MessagesScreen {...props} auth={auth} />
//               <Dash {...props} setAuth={setAuth} auth={auth} />
//             </>
//           )}
//         </Stack.Screen>
//         <Stack.Screen
//           name="Example"
//           component={Example}
//           options={({route}) => ({
//             title: route.params.userName,
//             headerBackTitleVisible: false,
//           })}></Stack.Screen>
//         <Stack.Screen name="Nearby List" component={NearbyList}></Stack.Screen>
//       </Stack.Navigator>
//     );
// }

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






// import React from "react";
// import { createStackNavigator } from "@react-navigation/stack";

// import Home from "./home";
// import About from "./about";

// const Stack = createStackNavigator();

// const StackNavigator2 = () => {
//   return (
//     <Stack.Navigator initialRouteName="Dash">
//       <Stack.Screen  name="MessagesScreen" component={Home} option={
//           {title: 'Home'}}/>
//       <Stack.Screen
//         name="Example"
//         component={Example} />
//     </Stack.Navigator>
//   );
// }

// export { StackNavigator2 };


// import React from "react";
// import { createStackNavigator } from "@react-navigation/stack";

// import Home from "./home";
// import About from "./about";

// const Stack = createStackNavigator();

// const StackNavigator2 = () => {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen name="Home" component={Home} option={
//           {title: 'Home'}}/>
//       <Stack.Screen name="About" component={About} />
//     </Stack.Navigator>
//   );
// }

export { StackNavigator2, NearbyStackNavigator };