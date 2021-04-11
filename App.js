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
 import NearbyList from './src/component/NearbyList';
 import ChatBox from './src/component/ChatBox';
 import useToken from './src/auth/useToken';
 import MessagesScreen from './src/component/messagesScreen';
 import { NavigationContainer } from '@react-navigation/native';
 import { createStackNavigator } from '@react-navigation/stack';
 import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
 import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
 // import Icon from 'react-native-vector-icons/Ionicons';
 import Icon from 'react-native-vector-icons/SimpleLineIcons';
 // import database from '@react-native-firebase/database';
 import {ChatStackNavigator, DashStackNavigator, NearbyStackNavigator, SettingsStackNavigator, LoginStackNavigator} from './src/component/StackNavigator';
import Signup from './src/component/Signup';
 
 
 
 
 const App: () => React$Node = () => {
   const [auth, setAuth] = useToken('');
 
   const Stack = createStackNavigator();
 
   const Tab = createMaterialBottomTabNavigator();
 
   return (
     <>
       {auth ?  
         <NavigationContainer>
           <Tab.Navigator
             activeColor="#fff"
             style={{ backgroundColor: 'tomato' }}
           >
             <Tab.Screen
               name="Dash"
               options={{
                 tabBarLabel: 'Contacts',
                 tabBarColor: '#1f65ff',
                 tabBarIcon: () => (
                   <Icon name="people" size={22} />
                 ),
               }}>
                {(props) => < DashStackNavigator {...props} setAuth={setAuth} auth={auth}/>}
               </Tab.Screen>
 
             <Tab.Screen 
               name="Message Screen"
               options={{
                 tabBarLabel: 'Chats',
                 tabBarColor: '#009387',
                 tabBarIcon: () => (
                   <Icon name="bubbles" size={22} />
                 ),
               }}>
               {(props) => < ChatStackNavigator {...props} auth={auth}/>}
             </Tab.Screen>
             <Tab.Screen
               name="Nearby List"
               options={{
                 tabBarLabel: 'Nearby',
                 tabBarColor: '#d02860',
                 tabBarIcon: () => (
                   <Icon name="compass" size={22} />
                 ),
               }}>
                 {(props) => < NearbyStackNavigator {...props} auth={auth}/>}
               </Tab.Screen>
             <Tab.Screen
               name="Add Friend"
               options={{
                 tabBarLabel: 'Settings',
                 tabBarColor: '#694fad',
                 tabBarIcon: () => (
                   <Icon name="settings" size={22} />
                 ),
               }}>
                  {(props) => < SettingsStackNavigator {...props} auth={auth}/>}
               </Tab.Screen>
           </Tab.Navigator>
         </NavigationContainer>
 
       /* <NavigationContainer>
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
           {/* <Stack.Screen
             name="Nearby List"
             component={NearbyList}
           >
           </Stack.Screen> */
          /* <Stack.Screen 
           name="Friends" component={Friends}
         >
         </Stack.Screen> */
         /* </Stack.Navigator>
       </NavigationContainer> */
        : 
        <NavigationContainer>
            <LoginStackNavigator setAuth={setAuth} />
        </NavigationContainer>
        }
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
