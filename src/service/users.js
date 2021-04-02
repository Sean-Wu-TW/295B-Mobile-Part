import firestore from '@react-native-firebase/firestore';

function userCache() {
    const users = {};
    const promises = {};
    function getUser(uid, forceFetch) {
        if (users[uid] && !forceFetch) {
            return Promise.resolve(users[uid]);
        }
        if (promises[uid]) {
            return promises[uid];
        }
        promises[uid] = firestore()
        .collection('users')
        .doc(uid)
        .get()
        .then(userSnapShot => {
            if (!userSnapShot.exists) {
                return null;
            }
            users[uid] = userSnapShot.data();
            promises[uid] = null;
            return userSnapShot.data();
        }, err => {
            console.log(error);
            return null;
        });
        return promises[uid];
    }

    return {getUser};
}

const usersCache = userCache();

export default usersCache;