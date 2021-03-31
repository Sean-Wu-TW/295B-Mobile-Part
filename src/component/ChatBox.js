import React, { useEffect, useState} from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { Button } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import users from '../service/users.js';

console.log("~~~~~~~~~~~~~~~~~", users);

const ChatBox = ({ navigation, route}) => {

  const [state, setState] = useState({ messages: [] });
  const whoami = route.params.auth;
  const talkingTo = route.params.userid;
  const chatId = route.params.chatId;
  console.log('I am: ', whoami);
  console.log('talkingTo: ', talkingTo);
  console.log('chat Id', chatId);
  console.log('param', route.params);
  
  function parseMsg(payload){
    function toDateTime(secs) {
      var t = new Date(1970, 0, 1); // Epoch
      t.setSeconds(secs);
      return t;
    }
    let res = {user: {}};
    if(payload?.createdAt){
      const date = toDateTime(payload.createdAt.seconds);
      res.createdAt = date;
      res._id = payload.createdAt.seconds;
    }
    if(payload?.text){
      res.text = payload.text;
    }
    console.log("payload _________________________________________________", payload.user.userid);
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
    console.log('chatId', chatId);

    const subscriber2 = firestore().collection('chatsV2')
    .doc(chatId)
    .onSnapshot(snapShot => {
      console.log('lalala', snapShot.data());
      let toAppend = [];
      let data = snapShot.data();
      let messages = data.messages;
      let count = messages.length;
      console.log('mesages length', count);
      messages.forEach(messageRef => messageRef.get().then(message => {
        let msgData = message.data();
        users.getUser(msgData.fromUser.id).then(user => {
          console.log('hahaha get user', msgData.fromUser.id, user);
          msgData.user = user;
          toAppend.push(parseMsg(msgData));
        })
      }).catch(err => {
        console.log("fkkkkkkkkkkkkkkkkkkkkkkkk", err);
      })
      .finally(_ => {
        count -= 1;
        if (count == 0) {
          console.log('setting msg', toAppend);
          setState({messages:toAppend});
        }
      }));
    });

    return () => subscriber2();
  },[]) 
 
  const onSend = (msg = []) => {
    // update chat history of mine
    firestore()
    .collection('users')
    .doc(whoami)
    .collection('chat')
    .doc(talkingTo)
    .collection('messages')
    .add({
      text: msg[0].text,
      createdAt: firestore.FieldValue.serverTimestamp(),
      user: {
        _id: whoami,
        avatar: 'https://placeimg.com/140/140/any',
        name: whoami
      }
    })
    .catch(console.error);

    // update chat history of other person
    firestore()
    .collection('users')
    .doc(talkingTo)
    .collection('chat')
    .doc(whoami)
    .collection('messages')
    .add({
      text: msg[0].text,
      createdAt: firestore.FieldValue.serverTimestamp(),
      user: {
        _id: whoami,
        avatar: 'https://placeimg.com/140/140/any',
        name: whoami
      }
    })
    .catch(console.error);
    setState({
        messages: [...msg, ...state.messages],
      })

    // TODO: update lastChat(timestamp) and lastChatContent
  }

    return (
      <>
      <Button
        title="Go to Dash"
        onPress={() => navigation.navigate('Dash')}
      />
      <GiftedChat
        messages={state.messages}
        onSend={(msg) => onSend(msg)}
        user={{
          _id: 1,
        }}
      />
      </>
    )
}

export default ChatBox;