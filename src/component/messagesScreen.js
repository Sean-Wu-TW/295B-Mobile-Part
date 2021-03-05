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
import firestore from '@react-native-firebase/firestore';
import UUIDGenerator from 'react-native-uuid-generator';


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

const Messages = [
  {
    id: '1',
    userid: 'johnid',
    userName: 'john',
  }
];


const MessagesScreen = ({navigation, auth}) => {
  const [inbox, setInbox] = useState([]);
  // TODO: extract the chats, and replace the dummy mesage list
  const fetchUserInfo = async () => {
    firestore()
    .collection('users')
    .doc(auth)
    .collection('chat')
    .get()
    .then(snapshot => {
      let toAppend = []
      snapshot.forEach(doc => {
        // extract the document ids in the chat collection
        // const data = doc.data(); -> returns {}, no data found
        console.log(doc.id);
        toAppend.push({    
          id: doc.id,
          userid: doc.id,
          userName: doc.id
        });
      });
      setInbox(toAppend);
    })
  }
  useEffect(() => {
    fetchUserInfo();

  }, [])



    return (
      <Container>
        <FlatList 
          data={inbox}
          keyExtractor={item=>item.id}
          renderItem={({item}) => (
            <Card onPress={() => navigation.navigate('Example', { userName: item.userName, userid: item.userid, auth: auth})}>
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