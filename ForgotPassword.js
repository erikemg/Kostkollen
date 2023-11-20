import React, { useState, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput } from 'react-native-gesture-handler';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { auth } from './firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("E-post skickad");
    } catch (error) {
      setMessage('Fel vid sändning av återställnings-e-post: ' + error);
    }
  };

  useEffect(() => {
    if (message !== "") {
      showNotification();
    }
  }, [message]);

  const showNotification = () => {
    slideAnimation.setValue(0);
    Animated.timing(slideAnimation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false,
    }).start();

    setTimeout(() => {
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }).start(() => {
        setMessage("");
      });
    }, 2000);
  };

  const interpolatedTranslateY = slideAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
  });

  return (
    <SafeAreaView style={styles.container} behavior="padding">
      <View style={styles.inputContainer}>
        <Text style={styles.header}>Återställ lösenord</Text>
        <View style={styles.textInputContainer}>
          <MaterialCommunityIcons name="email-outline" style={styles.icons} />
          <View style={styles.devider} />
          <TextInput
            placeholder='E-post'
            onChangeText={(text) => setEmail(text)}
            style={styles.input}
          />
        </View>
        <TouchableOpacity style={styles.submitButton} onPress={() => handleResetPassword()}>
          <Text style={styles.submitText}>Skicka</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginBackButton} onPress={() => {navigation.goBack()}}>
          <Text style={styles.loginBackText}>Tillbaka till inloggning</Text>
        </TouchableOpacity>
      </View>
      {message === "E-post skickad" && 
      <View style={styles.emailMessageSuccess}>
        <Text style={styles.emailText}>{message}</Text>
      </View>}
      {message !== "E-post skickad" && message !== "" && 
      <View style={styles.emailMessageError}>
        <Text style={styles.emailText}>{message}</Text>
      </View>}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    width: '80%',
  },
  textInputContainer: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    elevation: 1,
  },
  devider: {
    borderLeftColor: "gray",
    borderLeftWidth: 1,
    height: 30,
    marginRight: 10,
    marginLeft: 10,
  },
  input: {
    width: 250,
    height: 40,
  },
  icons: {
    fontSize: 20,
    color: "#333",
    marginLeft: 10,
  },
  submitButton: {
    backgroundColor: "#00FF00",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    borderRadius: 50,
    elevation: 1,
    marginTop: 10,
  },
  submitText: {
    fontWeight: 'bold',
    color: "white",
  },
  emailMessageSuccess: {
    position: "absolute",
    bottom: 20,
    backgroundColor: "green",
    justifyContent: "center",
    alignContent: "center",
    borderRadius: 10,
    height: 30,
    width: 150,
  },
  emailMessageError: {
    position: "absolute",
    bottom: 20,
    backgroundColor: "red",
    justifyContent: "center",
    alignContent: "center",
    borderRadius: 10,
  },
  emailText: {
    fontWeight: 'bold',
    color: "white",
    textAlign: "center",
    padding: 5,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: "center",
    marginBottom: 20,
  },
  loginBackButton: {
    marginTop: 10,
    width: 300
  },
  loginBackText: {
    color: 'black',
    textAlign: 'center',
    textDecorationLine: 'underline'
  },
});