import React, { useEffect, useState} from 'react';
import users from '../service/users.js';
import firestore from '@react-native-firebase/firestore';
import { StyleSheet, FlatList, Button, CheckBox, Text } from 'react-native';
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

const CURRENT_STATE_CHAT = 'chat';
const CURRENT_STATE_GROUP_CHAT = 'group_chat';

const Friends = ({ navigation, route}) => {
    const [friends, setFriends] = useState([]);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [currentState, setCurrentState] = useState(CURRENT_STATE_CHAT);

    let auth = route.params.auth;
    let currentUser;

    const loadAllFriends = async () => {
      console.log('lllll');
      users.getUser(auth).then(user => {
        console.log('hahahah');
        currentUser = user;
        let newFriends = user.friends;
        if (friends.length == newFriends.length) {
          return;
        }
        setFriends(newFriends);
        friends.forEach((friend, index) => {selectedFriends[index] = false});
        setSelectedFriends(selectedFriends);
      })
    }

    const navigateToChat = (userName, userId, chatId) => {
      console.log("click friend", userName, userId, auth, chatId);
      navigation.navigate('Example', {userName, userId, auth, chatId});
    }
    
    const pressFriend = async (userName, userId, chatId, avatar, friendIndex) => {
      if (currentState == CURRENT_STATE_GROUP_CHAT) {
        return;
      }
      if (chatId) {
        navigateToChat(userName, userId, chatId);
      } else {
        const current = firestore.Timestamp.now();
        firestore()
        .collection("chatsV2").add({
          isGroupChat: false,
          members: [
          {memberId: firestore().collection('users').doc(auth),
           name: currentUser.name,
           avatar: currentUser.avatar
          },
          {
            memberId: firestore().collection('users').doc(userId),
            name: userName,
            avatar
          }
          ],
          messages: []
      }).then(chatRef => {
        let chatId = chatRef.id;
        // update user's chat 
        const userChatUpdatePromise = firestore().collection('users')
        .doc(auth)
        .update({
          chats: firestore.FieldValue.arrayUnion({
            chatId:firestore().collection("chatsV2").doc(chatId),
            lastFetch: current,
            unread: 0
          }),
        }).catch(e => {
          console.log('what 1 ??????????????????????????????????', e);
          console.log(e.trace)
        });
        // update friend's chat
        const friendChatUpdatePromise = firestore().collection('users')
        .doc(userId)
        .update({
          chats: firestore.FieldValue.arrayUnion({
            chatId:firestore().collection("chatsV2").doc(chatId),
            lastFetch: current,
            unread: 0
          }),
        }).catch(e => {
          console.log('what 2 ??????????????????????????????????', e);
          console.log(e.trace)
        });
        // update current user's group
        currentUser.friends[friendIndex].chatId = chatId;
        const currentUserFriendsPromise = firestore().collection('users').doc(auth).update({
          friends: currentUser.friends
        }).catch(e => {
          console.log('what 3 ??????????????????????????????????', e);
          console.log(e.trace)
        });

        let friendRef = firestore().collection('users').doc(userId);
        const friendPromise = friendRef.get().then(friendSnap => {
          let friendData = friendSnap.data();
          let friends = friendData.friends;
          friends.forEach(friend => {if (friend.userId == auth) {
            friend.chatId = chatId;
          }});
          friendRef.update({friends})
        }).catch(e => {
          console.log('what 4 ??????????????????????????????????', e);
          console.log(e.trace)
        });
        return Promise.all(userChatUpdatePromise, friendChatUpdatePromise, currentUserFriendsPromise, friendPromise).then(() => {
          navigateToChat(userName, userId, chatRef.id);
        })
      }).catch(e => {
        console.log('what??????????????????????????????????', e);
      })
      }
    }

    const pressButton = (prevState) => {
      if (currentState == CURRENT_STATE_CHAT) {
        setCurrentState(CURRENT_STATE_GROUP_CHAT);
      } else {
        setCurrentState(CURRENT_STATE_CHAT);
      }
    }

    const select = (index) => {
      console.log("before", index, selectedFriends[index]);
      let selected = [...selectedFriends];
      selected[index] = !selected[index];
      setSelectedFriends(selected);
      console.log("after", index, selectedFriends[index]);
      console.log(selectedFriends);
    }
    
    console.log(123456)
    // setFriends(user.friends)
    loadAllFriends();
    // useEffect(() => {loadAllFriends()});
    // useEffect(() => {}, [])


    return (
        <Container>
          <FlatList 
            data={friends}
            keyExtractor={item=> item.userId}
            renderItem={({item, index}) => (
              <Card onPress={() => {
                pressFriend(item.userName, item.userId, item.chatId, item.avatar, index);
              }}>
                <UserInfo>
                  <CheckBox value={selectedFriends[index]} onValueChange={() => {select(index)}}></CheckBox>
                  <Text>x{index}x{selectedFriends[index].toString()}xx</Text>
                  <UserImgWrapper>
                    <UserImg source={{uri: item.avatar}} />
                  </UserImgWrapper>
                  <TextSection>
                    <UserInfoText>
                      <UserName>{item.userName} {selectedFriends[index]}</UserName>
                    </UserInfoText>
                  </TextSection>
                </UserInfo>
              </Card>
            )}
          />
          <Button title={currentState == CURRENT_STATE_CHAT ? 'create group chat':'start chat'} onPress={pressButton}></Button>
        </Container>
      );
}

export default Friends;