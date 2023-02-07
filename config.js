//firebase config key setep
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDv-VEWKXg2vCZjdWg6C7w0lXbvw4J7fnQ",
  authDomain: "bando-bites.firebaseapp.com",
  projectId: "bando-bites",
  storageBucket: "bando-bites.appspot.com",
  messagingSenderId: "7575103153",
  appId: "1:7575103153:web:34c20330ea55aed60b2490",
  measurementId: "G-S7EDH70279"
};


// Initialize Firebase
if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig)
}

export { firebase };
