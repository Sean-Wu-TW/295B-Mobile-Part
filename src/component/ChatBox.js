import React, { useEffect, useState} from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { Button } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const ChatBox = ({ navigation, route}) => {

  const [state, setState] = useState({ messages: [] });
  const whoami = route.params.auth;
  const talkingTo = route.params.userid;
  console.log('I am: ', whoami);
  console.log('talkingTo: ', talkingTo);
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
    if(payload.user?._id === whoami){
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
    const subscriber = firestore()
    .collection('users')
    .doc(whoami)
    .collection('chat')
    .doc(talkingTo)
    .collection('messages')
    .orderBy("createdAt","desc")
    .onSnapshot(documentSnapshot => {
      let toAppend = [];
      documentSnapshot.forEach(msg => {
        // console.log(parseMsg(msg.data()));
        toAppend.push(parseMsg(msg.data()));
      });
      // toAppend.sort(function(a,b){
      //   // https://stackoverflow.com/questions/10123953/how-to-sort-an-object-array-by-date-property
      //   // Turn your strings into dates, and then subtract them
      //   // to get a value that is either negative, positive, or zero.
      //   return new Date(b.createdAt) - new Date(a.createdAt);
      // });
      setState({ messages: toAppend});
    });

    return () => subscriber();
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