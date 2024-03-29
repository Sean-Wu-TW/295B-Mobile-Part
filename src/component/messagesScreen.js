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

  console.log('this is', auth)
  // deprecated
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


  // when a chat list item is clicked, navigate to the chat chatbox screen
  function pressChat(userName, auth, chatId) {
    chats.forEach(chat => {
      if (chat.chatId.id == chatId) {
        chat.lastFetch = firebase.firestore.Timestamp.fromDate(new Date());
         chat.unread=0;
        }
      });
    firestore().collection('users').doc(auth).update({chats}).then(()=> {
      navigation.navigate('ChatBox', {userName, auth, chatId});
    });
  }

  useEffect(() => {
    //fetchUserInfo();
    // this function is used for fetching/updating user's chat list
    const fetchUserInfoV2 = 
      firestore()
      .collection('users')
      .doc(auth)
      .onSnapshot(snapshot => {
        let toAppend = [];
        chats = snapshot.data().chats;
        if (chats == null || chats.length == 0) {
          return;
        }
        let count = chats.length;
        snapshot.data().chats.forEach(chat => {
          console.log('chat$$$$$$$$$$$$$$$$', chat);
          let chtRef = chat.chatId;
          // load each chat detail information for current user
          chtRef.get().then(chatSnapshot => {
            let data = chatSnapshot.data();
            
            let chatItem = {
              id: chtRef.id,
              chatId: chtRef.id,
              userName: data.isGroupChat? data.name: data.members.find(member=> member.memberId.id != auth).name,
              messageTime: data.lastMessage?.toDate().toDateString(),
              userImage: data.isGroupChat? 'https://picsum.photos/200': (data.members.find(member=> member.memberId.id != auth).avatar || 'https://picsum.photos/200'),
              messageText: data.unread > 0 ?  (data.unread > 1 ? `{data.unread} new messages`: `{data.unread} new message`) : 'no new messages',
              isGroupChat: data.isGroupChat
            };
            console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%", chatItem);
            toAppend.push(chatItem);
          },err => {
            console.log(error);
          }).finally(_ => {
            count -= 1;
            if (count <= 0) {
              // when all the chats are loaded, render the UI
              setInbox(toAppend);
            }
          });
        })
      });

    return () => fetchUserInfoV2();
  }, [])



    return (
      <Container>
        <FlatList 
          data={inbox}
          keyExtractor={item=>item.id}
          renderItem={({item}) => (
           /* <Card onPress={() => navigation.navigate('Example', { userName: item.userName, userid: item.userid, auth: auth, chatId: item.chatId})}> */
            /*<Card onPress={() => navigation.navigate('Example', { userName: item.userName, userid: item.userid, auth: auth})}>*/
            <Card onPress={() => pressChat(item.userName, auth, item.chatId)}>
              <UserInfo>
                <UserImgWrapper>
                  <UserImg source={{uri: item.userImage}} />
                </UserImgWrapper>
                <TextSection>
                  <UserInfoText>
                    {item.isGroupChat ? <UserName>Group: {item.userName}</UserName> : <UserName>{item.userName}</UserName>}
                    
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