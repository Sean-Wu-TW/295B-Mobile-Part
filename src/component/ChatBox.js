import React, { useEffect, useState} from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { Button, View } from 'react-native';
import {Container} from '../styles/messageStyles';
import firestore from '@react-native-firebase/firestore';
import users from '../service/users.js';

const ChatBox = ({ navigation, route}) => {


  const [state, setState] = useState({ messages: [] });
  const whoami = route.params.auth;
  const talkingTo = route.params.userid;
  const chatId = route.params.chatId;
  console.log('I am: ', whoami);
  console.log('talkingTo: ', talkingTo);
  console.log('chat Id', chatId);
  console.log('param', route.params);
  
  function parseMsg(payload) {
    function toDateTime(secs) {
      var t = new Date(1970, 0, 1); // Epoch
      t.setSeconds(secs);
      return t;
    }
    let res = {user: {}};
    if(payload?.createdAt){
      const date = toDateTime(payload.createdAt.seconds);
      res.createdAt = date;
      res._id = payload.createdAt.seconds + payload.user?.userid;
    }
    if(payload?.text){
      res.text = payload.text;
    }
    if(payload.user?.userid === whoami){
      res.user._id = 1
    }else{
      res.user._id = 2
    }
    res.user.avatar = payload?.user?.avatar;
    res.user.name = payload?.user?.name;
    return res
  }
  // console.log(state.messages)



  useEffect(() => {

    // users/{userid}/chat/{another userid}/messages
    // messages: [{"_id": 1614772278, "createdAt": 2021-03-03T03:51:18.000Z, "text": "Yu", 
    // "user": {"_id": 1, "avatar": "https://placeimg.com/140/140/any", "name": "john"}}]

    // grabs chat from firestore
    // const subscriber = firestore()
    // .collection('users')
    // .doc(whoami)
    // .collection('chat')
    // .doc(talkingTo)
    // .collection('messages')
    // .onSnapshot(documentSnapshot => {
    //   let toAppend = [];
    //   documentSnapshot.forEach(msg => {
    //     // console.log(parseMsg(msg.data()));
    //     toAppend.push(parseMsg(msg.data()));
    //   });
    //   toAppend.sort(function(a,b){
    //     // https://stackoverflow.com/questions/10123953/how-to-sort-an-object-array-by-date-property
    //     // Turn your strings into dates, and then subtract them
    //     // to get a value that is either negative, positive, or zero.
    //     return new Date(b.createdAt) - new Date(a.createdAt);
    //   });
    //   setState({ messages: toAppend});
    // });

    const subscriber2 = firestore().collection('chatsV2')
    .doc(chatId)
    .onSnapshot(snapShot => {
      let toAppend = [];
      let data = snapShot.data();
      let messages = data.messages;
      
      if (messages == null || messages.length == 0) {
        return;
      }
      let count = messages.length;
      messages.forEach(messageRef => messageRef.get().then(message => {
        let msgData = message.data();
        users.getUser(msgData.fromUser.id).then(user => {
          msgData.user = user;
          toAppend.push(parseMsg(msgData));
        })
      })
      .finally(_ => {
        count -= 1;
        if (count == 0) {
          console.log("messages all loaded");
                toAppend.sort(function(a,b){
                  return new Date(b.createdAt) - new Date(a.createdAt);});
          setState({messages:toAppend});
        }
      }));
    });

    return () => subscriber2();
    },[])
 
  // deprecated
  // const onSend = (msg = []) => {
  //   // update chat history of mine
  //   firestore()
  //   .collection('users')
  //   .doc(whoami)
  //   .collection('chat')
  //   .doc(talkingTo)
  //   .collection('messages')
  //   .add({
  //     text: msg[0].text,
  //     createdAt: firestore.FieldValue.serverTimestamp(),
  //     user: {
  //       _id: whoami,
  //       avatar: 'https://placeimg.com/140/140/any',
  //       name: whoami
  //     }
  //   })
  //   .catch(console.error);

  //   // update chat history of other person
  //   firestore()
  //   .collection('users')
  //   .doc(talkingTo)
  //   .collection('chat')
  //   .doc(whoami)
  //   .collection('messages')
  //   .add({
  //     text: msg[0].text,
  //     createdAt: firestore.FieldValue.serverTimestamp(),
  //     user: {
  //       _id: whoami,
  //       avatar: 'https://placeimg.com/140/140/any',
  //       name: whoami
  //     }
  //   })
  //   .catch(console.error);
  //   setState({
  //       messages: [...msg, ...state.messages],
  //     })

  //   // TODO: update lastChat(timestamp) and lastChatContent
  // }

  // when send message button pressed
  const onSendV2 = (msg) => {
    let createdAt = firestore.Timestamp.fromDate(new Date())
    //first create message.
    firestore()
    .collection('messages')
    .add({
      chatId,
      fromUser: firestore().collection('users').doc(whoami),
      text: msg.text,
      createdAt
    }).then(message => {
      // save it into chats of current user
      let chat = firestore().collection('chatsV2')
      .doc(chatId);
      return chat.update({
        messages: firestore.FieldValue.arrayUnion(message),
        lastMessage:createdAt
      }).then(() => {
        return {chat, message};
      });
    })
    .then(({chat, message}) => {
      // update chats(inbox) of other users in the same chat session
      return chat.get().then(chatSnapshot => {
        let users = chatSnapshot.data().members;
        let ucount = users.length;
        users.forEach(u => {
          if (u.memberId.id != whoami) {
            u.memberId.get().then(userSnapshot => {
              let user = userSnapshot.data();
              console.log("updating ~~~~~~~~~~~~~~~~~", user, user.chats);
              let chats2Update = user.chats;
              let find = 0;
              chats2Update.forEach(c => {
                if (c.chatId && c.chatId.id == chatId) {
                  find = 1;
                  if (c.lastFetch.seconds < createdAt.seconds) {
                    c.unread += 1;
                  }
                }
              });
              if (find == 0) {
                chats2Update.push({
                  chatId,
                  lastFetch: createdAt,
                  unread:1
                });
              }
              return u.memberId.update({chats:chats2Update});
            })
            .finally(() => {
              ucount -= 1;
              if (ucount == 1) {
                // when all the chats are updated, render the latest message
                setState({
                  messages: [msg, ...state.messages],
                })
              }
            })
          }
        })
      })
    });
  } 

    return (
      <View style={{flex:1, backgroundColor:'#ffffff'}}>
      <GiftedChat
        messages={state.messages}
        onSend={([msg]) => onSendV2(msg)}
        style={{ backgroundColor: "#ffffff", flex: 1 }}
        user={{
          _id: 1,
        }}
      />
      </View>
    )
}

export default ChatBox;