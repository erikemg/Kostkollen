import React, { useState, useEffect, useCallback } from "react";
import { View, ActivityIndicator } from "react-native";
import Navigation from "./Navigator";
import LoginStack from "./Login";
import { auth, usersRef } from "./firebase";
import { GoogleAuthProvider, onAuthStateChanged, signInWithCredential } from "firebase/auth";
import { get } from 'firebase/database';
import EmailVerification from "./EmailVerification";
import * as Google from "expo-auth-session/providers/google"
import FoodPreferences from "./FoodPreferencesInitial";
import 'expo-dev-client'
import { AdsConsent } from 'react-native-google-mobile-ads';

const App = () => {
  const [user, setUser] = useState(null);
  const [infoEntered, setInfoEntered] = useState(false);
  const [verified, setVerified] = useState(false)
  const [loading, setLoading] = useState(true);
  const [request, response, promptAsync] = Google.useAuthRequest({
    useProxy: true,
    expoClientId: "",
    androidClientId: '905878259952-gh2s6pv5ivhl6oiihfb9obrqtfima106.apps.googleusercontent.com',
  })
  useEffect(() => {
    const fetchData = async () => {
      const unSubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          if (user.emailVerified) {
            setVerified(true);
          }
          const usersSnapshot = await get(usersRef);
          usersSnapshot.forEach((userSnapshot) => {
            if (userSnapshot.key === user.uid) {
              setInfoEntered(true);
            }
          });
          setUser(user);
          setLoading(false);
        } else {
          setUser(null);
          setTimeout(() => {
            setLoading(false);
          }, 100);
        }
      });

      return () => unSubscribe();
    };
  
    fetchData();
  }, []);
  
useEffect(() => {
  if (response?.type === "success") {
    const { id_token } = response.params;
    const credential = GoogleAuthProvider.credential(id_token);
    signInWithCredential(auth, credential)
    .then(() => {setVerified(true)})
      .catch((error) => {
        setLoading(false);
      });
  } else if (response?.type === "dismiss" || response?.type === "error") {
    setLoading(false)
  }
}, [response]);

useEffect(() => {
  getPerm()
}, [user])

const promptAsyncGoogle = useCallback(() => {
  promptAsync()
}, [promptAsync])

const getPerm = async () => {
    state = await AdsConsent.requestInfoUpdate();
    if(state == "REQUIRED" || state == "UNKNOWN") {
    await AdsConsent.showForm()
    } 
}

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }
  if (user == null) {
    return <LoginStack infoEntered={infoEntered} setInfoEntered={info => setInfoEntered(info)} promptAsyncGoogle={info => promptAsyncGoogle(info)} setLoading={info => setLoading(info)} setUser={info => setUser(info)}/>;
  } else if (!infoEntered) {
    return <FoodPreferences setInfoEntered={info => setInfoEntered(info)} />
  } else if (!verified) {
    return <EmailVerification verified={verified} setVerified={info => setVerified(info)} setInfoEntered={info => setInfoEntered(info)} setUser={info => setUser(info)} user={user}/>;
  } else {
    return <Navigation setInfoEntered={info => setInfoEntered(info)} user={user} setVerified={info => setVerified(info)}/>;
  }
};

export default App;