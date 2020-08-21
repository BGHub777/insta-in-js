import firebase from "firebase";

const firebaseApp = firebase.initializeApp ({
    apiKey: "AIzaSyDr7REuTeycOMAjVbxoLAqNet5z2rn3ZbQ",
    authDomain: "insta-in-js.firebaseapp.com",
    databaseURL: "https://insta-in-js.firebaseio.com",
    projectId: "insta-in-js",
    storageBucket: "insta-in-js.appspot.com",
    messagingSenderId: "187311826681",
    appId: "1:187311826681:web:43738eac4b3eef143a6428"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage }