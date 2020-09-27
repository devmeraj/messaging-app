import firebase from 'firebase/app';

import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/database';

var firebaseConfig = {
    apiKey: "AIzaSyBKuTWzLil2a3WZ9GlLip5RdL4KxmxrVME",
    authDomain: "slack-clone-app-react.firebaseapp.com",
    databaseURL: "https://slack-clone-app-react.firebaseio.com",
    projectId: "slack-clone-app-react",
    storageBucket: "slack-clone-app-react.appspot.com",
    messagingSenderId: "704745803538",
    appId: "1:704745803538:web:7f59d4793ea5b98ec42dcb"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
export const database = firebase.database();

export const createUserProfile = async (user, additionalData) => {
    if(!user) return;

    const userRef = firestore.doc(`/users/${user.uid}`);
        const snapShot = await userRef.get();

        if(!snapShot.exists) {
            const {email} = user;
            await userRef.set({
                email,
                ...additionalData
            });
        }
    return userRef;
}

export const addMessages = async (message, currentChannel) => {
    // const collectionRef = firestore.collection(`messages`);
    firestore.collection('messages').doc(currentChannel.id).collection('message').doc().set(message);

    
}


export default firebase;