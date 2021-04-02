import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import {
  Container,
  Card,
  UserInfo,
  UserImgWrapper,
  UserImg,
  UserInfoText,
  UserName,
  PostTime,
  MessageText,
  TextSection,
} from '../styles/messageStyles';
import firestore, { firebase } from '@react-native-firebase/firestore';
import UUIDGenerator from 'react-native-uuid-generator';
import utils from '../util';

let chats = [];

const messages = [
  {
    id: '1',
    userid: 'johnid',
    userName: 'john',
    userImg: require('../../assests/user-3.jpg'),
    messageTime: '4 mins ago',
    messageText:
      'Hey there, this is my test for a post of my social app in React Native.',
  }
];


const MessagesScreen = ({navigation, auth}) => {
  const [inbox, setInbox] = useState([]);

  const fetchUserInfo = async () => {
    firestore()
    .collection('users')
    .doc(auth)
    .collection('chat')
    .get()
    .then(snapshot => {
      let toAppend = [];
      snapshot.forEach(doc => {
        // extract the document ids in the chat collection
        // const data = doc.data(); -> returns {}, no data found
        // console.log("friend: ", doc.get('lastChat').toDate().toDateString());
        toAppend.push({    
          id: doc.id,
          userid: doc.id,
          userName: doc.id,
          messageTime: doc.get('lastChat')?.toDate().toDateString(),
        });
      });
      setInbox(toAppend);
    })
  };

  const fetchUserInfoV2 = async () => {
    firestore()
    .collection('users')
    .doc(auth)
    .get()
    .then(snapshot => {
      let toAppend = [];
      chats = snapshot.data().chats;
      let count = chats.length;
      console.log("~~~~~~~~~~", chats);
      snapshot.data().chats.forEach(chat => {
        let chtRef = chat.chatId;
        console.log(chat.chatId);
        chtRef.get().then(chatSnapshot => {
          let data = chatSnapshot.data();
          toAppend.push({
            id: data.id,
            userid: data.id,
            chatId: chtRef.id,
            userName: data.name,
            messageTime: data.lastMessage?.toDate().toDateString()
          });
        },err => {
          console.log(error);
        }).finally(_ => {
          count -= 1;
          if (count <= 0) {
            setInbox(toAppend);
          }
        });
      })
    })
  };

  function pressChat(userName, userId, auth, chatId) {
    chats.forEach(chat => {
      if (chat.chatId.id == chatId) {
        chat.lastFetch = firebase.firestore.Timestamp.fromDate(new Date());
         chat.unread=0;
        }
      });
    firestore().collection('users').doc(auth).update({chats}).then(()=> {
      navigation.navigate('Example', {userName, userId, auth, chatId});
    });
  }

  useEffect(() => {
    //fetchUserInfo();
    fetchUserInfoV2();
  }, [])



    return (
      <Container>
        <FlatList 
          data={inbox}
          keyExtractor={item=>item.id}
          renderItem={({item}) => (
           /* <Card onPress={() => navigation.navigate('Example', { userName: item.userName, userid: item.userid, auth: auth, chatId: item.chatId})}> */
            /*<Card onPress={() => navigation.navigate('Example', { userName: item.userName, userid: item.userid, auth: auth})}>*/
            <Card onPress={() => pressChat(item.userName, item.userId, auth, item.chatId)}>
              <UserInfo>
                <UserImgWrapper>
                  <UserImg source={item.userImg} />
                </UserImgWrapper>
                <TextSection>
                  <UserInfoText>
                    <UserName>{item.userName}</UserName>
                    <PostTime>{item.messageTime}</PostTime>
                  </UserInfoText>
                  <MessageText>{item.messageText}</MessageText>
                </TextSection>
              </UserInfo>
            </Card>
          )}
        />
      </Container>
    );
};

export default MessagesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
});