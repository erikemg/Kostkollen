import React, { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import Navigation from "./Navigator";
import LoginStack from "./Login";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import EmailVerification from "./EmailVerification";

const App = () => {
  const [user, setUser] = useState(null);
  const [infoEntered, setInfoEntered] = useState(false);
  const [verified, setVerified] = useState(false)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const unSubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setUser(user);
          if (user.emailVerified) {
            setVerified(true)
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      });
      return () => unSubscribe();
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }
  if (user == null || !infoEntered) {
    return <LoginStack infoEntered={infoEntered} setInfoEntered={info => setInfoEntered(info)}/>;
  } else if (!verified) {
    return <EmailVerification verified={verified} setVerified={info => setVerified(info)}/>;
  } else {
    return <Navigation setInfoEntered={info => setInfoEntered(info)} user={user} setVerified={info => setVerified(info)}/>;
  }
};

export default App;