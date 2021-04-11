import React, { useEffect, useState} from 'react';
import users from '../service/users.js';
import firestore from '@react-native-firebase/firestore';
import { StyleSheet, FlatList, Button, CheckBox, Text, TextInput } from 'react-native';
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

const Friends = ({navigation, auth}) => {
    const [groupName, onChangeGroupName] = React.useState("group chat name");
    const [friends, setFriends] = useState([]);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [currentState, setCurrentState] = useState(CURRENT_STATE_CHAT);
    const [selectedCount, setSelectedCount] = useState(0);

    let currentUser;

    const loadAllFriends = async () => {
      users.getUser(auth).then(user => {
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
      navigation.navigate('ChatBox', {userName, userId, auth, chatId});
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
        // update current user-friend chat
        currentUser.friends[friendIndex].chatId = chatId;
        const currentUserFriendsPromise = firestore().collection('users').doc(auth).update({
          friends: currentUser.friends
        }).catch(e => {
          console.log('what 3 ??????????????????????????????????', e);
          console.log(e.trace)
        });

        // update current user-friend chat
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

    const pressStartGroupChat = () => {
      const current = firestore.Timestamp.now();
      const members = [
        {memberId: firestore().collection('users').doc(auth),
        name: currentUser.name,
        avatar: currentUser.avatar
        }];
      const chatMemberIds = [auth];
      friends.forEach((friend, i) => {
        if (selectedFriends[i]) {
          members.push({
            memberId: firestore().collection('users').doc(friend.userId),
            name: friend.userName,
            avatar: friend.avatar
          });
          chatMemberIds.push(friend.userId)
        }
      });
      console.log("$$$$$$$$$$$ members", members);
      firestore()
      .collection("chatsV2").add({
        isGroupChat: true,
        messages: [],
        members,
        name: groupName
        }).then(chatRef => {
          let chatId = chatRef.id;
          console.log('group created', chatId);
          let chatItem = {
            chatId:firestore().collection("chatsV2").doc(chatId),
            lastFetch: current,
            unread:0
          }
          const chatUpdats = chatMemberIds.map((id, index) => {
            console.log('～～～upading user', id);
            return firestore().collection('users')
            .doc(id)
            .update({
              chats: firestore.FieldValue.arrayUnion(chatItem),
            }).catch(e => console.log('fkup ', id, e));  
          });
            return Promise.all(chatUpdats).then(() => {
              navigateToChat(groupName, auth, chatRef.id);
            })
        });
    }

    const pressButton = (prevState) => {
    }

    const startSelection = () => {
      setCurrentState(CURRENT_STATE_GROUP_CHAT);
    }

    const cancleSelection = () => {
      setCurrentState(CURRENT_STATE_CHAT);
      let selected = [];
      selectedFriends.forEach((_, index) => selected[index]=false);
      setSelectedFriends(selected);
      setSelectedCount(0);
    }

    const select = (index) => {
      console.log("before", index, selectedFriends[index]);
      let selected = [...selectedFriends];
      selected[index] = !selected[index];
      if (selected[index]) {
        setSelectedCount(selectedCount+1);
      } else {
        setSelectedCount(selectedCount-1);
      }
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
          {currentState == CURRENT_STATE_GROUP_CHAT ?
          <TextInput
          onChangeText={onChangeGroupName}
          value={groupName}
          /> : null}
          <FlatList 
            data={friends}
            keyExtractor={item=> item.userId}
            renderItem={({item, index}) => (
              <Card onPress={() => {
                pressFriend(item.userName, item.userId, item.chatId, item.avatar, index);
              }}>
                <UserInfo>
                  {
                    currentState == CURRENT_STATE_GROUP_CHAT ? <CheckBox value={selectedFriends[index]} onValueChange={() => {select(index)}}></CheckBox>
                    : null
                  }
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
          { currentState == CURRENT_STATE_CHAT ?
            <Button title='create group chat' onPress={startSelection}></Button>
            : <><Button title='start chat' disabled={selectedCount <= 1} onPress={pressStartGroupChat}></Button>
              <Button title='cancel' onPress={cancleSelection}></Button></>
          }
        </Container>
      );
}

export default Friends;