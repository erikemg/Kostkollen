import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getAuth, getReactNativePersistence, GoogleAuthProvider } from 'firebase/auth';
import { getDatabase, ref } from 'firebase/database';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FacebookAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAW6jci0BBnqvgemi3-wLseP4bV83CJPYs",
    authDomain: "alergyapp-78ded.firebaseapp.com",
    databaseURL: 'https://alergyapp-78ded-default-rtdb.europe-west1.firebasedatabase.app/',
    projectId: "alergyapp-78ded",
    storageBucket: "alergyapp-78ded.appspot.com",
    messagingSenderId: "284520991509",
    appId: "1:284520991509:web:db7c2becfe7037f906771c",
    measurementId: "G-VTJXY8X855"
  };

  let auth;
  let app;

  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
    });
    
    } else {
    app = getApp();
    auth = getAuth(app);
    }
  const db = getDatabase(app);
  const usersRef = ref(db, 'users');
  const foodsInDb = ref(db, 'foods');

  const googleProvider = new GoogleAuthProvider()
  const facebookProvider = new FacebookAuthProvider()
  
  export { auth, googleProvider, usersRef, facebookProvider, db, foodsInDb};