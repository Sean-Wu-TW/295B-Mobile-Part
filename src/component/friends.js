import React, { useEffect, useState} from 'react';
import users from '../service/users.js';
import firestore, { firebase } from '@react-native-firebase/firestore';
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
    // group chat name
    const [groupName, onChangeGroupName] = React.useState("");
    // friends list
    const [friends, setFriends] = useState([]);
    // selected friend, used for rendering checkbox when select friends
    const [selectedFriends, setSelectedFriends] = useState([]);
    // is creating group chat or not
    const [currentState, setCurrentState] = useState(CURRENT_STATE_CHAT);
    // how many friends are select for group chat
    const [selectedCount, setSelectedCount] = useState(0);
    const [currentUser, setCurrentUser] = useState({});

    // load all friends and update friends list
    const loadAllFriends = () => {
      firestore()
      .collection('users')
      .doc(auth)
      .onSnapshot(data => {
        // once the data changed, get the latest friends list
        let user = data.data();
        setCurrentUser(user);
        console.log("Ccccccccc", currentUser);
        let newFriends = user.friends;
        if (newFriends == null || (friends.length == newFriends.length)) {
          return;
        }
        
        // if the length is not same then replace the legacy list and render UI
        setFriends(newFriends);
        // reset the selected array for group chat
        friends.forEach((friend, index) => {selectedFriends[index] = false});
        setSelectedFriends(selectedFriends);
      })
    }

    // helper function to do naviagate to chat box
    const navigateToChat = (userName, userId, chatId) => {
      navigation.navigate('ChatBox', {userName, userId, auth, chatId});
    }
    
    // handle when friend list item is pressed
    const pressFriend = async (userName, userId, chatId, avatar, friendIndex) => {
      // if in selecting group members state, then treat as the check box is clicked.
      if (currentState == CURRENT_STATE_GROUP_CHAT) {
        select(friendIndex);
        return;
      }
      // if current user has a chat session with the friend, go to that chat session directly.
      if (chatId) {
        navigateToChat(userName, userId, chatId);
      } else {
        const current = firestore.Timestamp.now();
        //create a chat session first
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
        // update current user's chat list
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
        // update friend's chat list
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
        // attach the chat session to the friend in the friends list of current user
        currentUser.friends[friendIndex].chatId = chatId;
        const currentUserFriendsPromise = firestore().collection('users').doc(auth).update({
          friends: currentUser.friends
        }).catch(e => {
          console.log('what 3 ??????????????????????????????????', e);
          console.log(e.trace)
        });

        // attach the chat session to the friend in the friends list of the friend
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
      console.log("@@@@@@@@@", currentUser);
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

    // when the create group button is pressed
    const startSelection = () => {
      setCurrentState(CURRENT_STATE_GROUP_CHAT);
    }

    // user stop creating the group chat, clear all the state.
    const cancleSelection = () => {
      setCurrentState(CURRENT_STATE_CHAT);
      let selected = [];
      selectedFriends.forEach((_, index) => selected[index]=false);
      setSelectedFriends(selected);
      setSelectedCount(0);
    }

    // when the checkbox is clicked
    const select = (index) => {
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
    // loadAllFriends();
    useEffect(() => {loadAllFriends()},[]);
    // useEffect(() => {}, [])


    return (
      <>
        <Container>
          
          <FlatList 
            data={friends}
            keyExtractor={item=> item.userId}
            renderItem={({item, index}) => (
              <Card onPress={() => {
                pressFriend(item.userName, item.userId, item.chatId, item.avatar, index);
              }}>
                <UserInfo style={styles.userInfo}>
                  {
                    currentState == CURRENT_STATE_GROUP_CHAT ? <CheckBox style={styles.checkBox} value={selectedFriends[index]} onValueChange={() => {select(index)}}></CheckBox>
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
          </Container>
          {currentState == CURRENT_STATE_GROUP_CHAT ?
          <TextInput
          onChangeText={onChangeGroupName}
          placeholder='please enter a group chat name'
          value={groupName}
          /> : null}
          { currentState == CURRENT_STATE_CHAT ?
            <Button title='create group chat' onPress={startSelection} color="orange"></Button>
            : <><Button title='start chat' disabled={selectedCount < 2 || groupName.length < 1} onPress={pressStartGroupChat} color="green"></Button>
              <Button title='cancel' onPress={cancleSelection}></Button></>
          }
        </>
      );
}

const styles = StyleSheet.create({
  title: {
      fontSize: 20
  },
  header: {
      fontSize: 28,
  },
  userInfo: {
    display: 'flex'
  },
  checkBox: {
    marginTop: 25,
    marginRight: 10
  }
})

export default Friends;