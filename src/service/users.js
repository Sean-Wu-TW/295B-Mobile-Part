import firestore from '@react-native-firebase/firestore';

function userCache() {
    const users = {};
    function getUser(uid, forceFetch) {
        console.log('try to get user making call aaa', uid);
        if (users[uid] && !forceFetch) {
            return Promise.resolve(users[uid]);
        }
        console.log('try to get user making call', uid);
        return firestore()
        .collection('users')
        .doc(uid)
        .get()
        .then(userSnapShot => {
            if (!userSnapShot.exists) {
                return null;
            }
            users[uid] = userSnapShot.data();
            return userSnapShot.data();
        }, err => {
            console.log(error);
            return null;
        })
    }

    return {getUser};
}

const usersCache = userCache();

export default usersCache;