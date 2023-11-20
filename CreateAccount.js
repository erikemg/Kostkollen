import React, { useState, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput } from 'react-native-gesture-handler';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { auth } from './firebase';
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

export default function CreateAccount({ route }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [displayError, setDisplayError] = useState('');
  const [user, setUser] = useState(null);
  const { promptAsyncGoogle, setLoading } = route.params;
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const navigate = useNavigation();

  useEffect(() => {
    if (displayError !== '') {
      showNotification();
    }
  }, [displayError]);

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
        setDisplayError('');
      });
    }, 2000);
  };

  const handleCreateAccount = async () => {
    if (password === password2) {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
      } catch (error) {
        setDisplayError(error.message);
      }
    } else {
      setDisplayError("Lösenorden matchar inte");
    }
  };

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unSubscribe();
  }, []);

  return (
    <SafeAreaView style={styles.container} behavior="padding">
      <View style={styles.inputContainer}>
        <Text style={styles.header}>Skapa konto</Text>
        <View style={styles.textInputContainer}>
          <MaterialCommunityIcons name="account-outline" style={styles.icons} />
          <View style={styles.devider} />
          <TextInput
            placeholder="E-post"
            onChangeText={(text) => setEmail(text)}
            style={styles.input}
          />
        </View>
        <View style={styles.textInputContainer}>
          <MaterialCommunityIcons name="lock-outline" style={styles.icons} />
          <View style={styles.devider} />
          <TextInput
            placeholder="Lösenord"
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={true}
            style={styles.input}
          />
        </View>
        <View style={styles.textInputContainer}>
          <MaterialCommunityIcons name="lock-outline" style={styles.icons} />
          <View style={styles.devider} />
          <TextInput
            placeholder="Bekräfta lösenord"
            onChangeText={(text) => setPassword2(text)}
            secureTextEntry={true}
            style={styles.input}
          />
        </View>
        <TouchableOpacity style={styles.createAccount2} onPress={handleCreateAccount}>
          <Text style={styles.createAccountText2}>Skapa konto</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginBackButton} onPress={() => navigate.goBack()}>
          <Text style={styles.loginBackText}>Gå tillbaka till inloggning</Text>
        </TouchableOpacity>
        <View style={styles.horizontalDevider} />
        <TouchableOpacity style={styles.googleButton} onPress={() => { promptAsyncGoogle(); setLoading(true) }}>
          <View style={styles.buttonIcon}>
            <AntDesign name="google" style={styles.googleIcon} />
          </View>
          <Text style={styles.googleTextCreate}>Skapa konto med Google</Text>
        </TouchableOpacity>
      </View>
      {displayError !== '' && (
        <View style={styles.passwordsDontMatch}>
          <Text style={styles.passwordsDontMatchText}>{displayError}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  shadowContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    margin: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: "center"
  },
  smallHeader: {
    fontSize: 15,
    fontWeight: '600',
    marginRight: 10,
    marginTop: 10
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#FDFDFD',
  },
  infoButton: {
    backgroundColor: '#333',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },
  infoButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 14,
  },
  closeButton: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignSelf: 'flex-end',
  },
  closeButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  allergyContainer: {
    flexDirection: 'column',
    marginBottom: 10,
    borderBottomColor: "#FFF",
    borderTopColor: "#808080",
    borderRightColor: "#FFF",
    borderLeftColor: "#FFF",
    borderWidth: 1
  },
  allergyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  icon: {
    width: 60,
    height: 60,
    marginRight: 10,
    opacity: 0.1
  },
  iconActive: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  addFoodButton: {
    backgroundColor: '#00FF00',
    borderRadius: 50,
    width: 150,
    height: 50,
    justifyContent: "center"
  },
  addFoodButtonContainer: {
    marginTop: 20,
    width: "100%",
    alignItems: 'center',
  },
  addFoodText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: "center",
    color: "white"
  },
  buttonContainerAleart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },
  dismissButton: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    width: '45%',
    alignItems: 'center',
  },
  dismissButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  enterInfoButton: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  enterInfoButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  modalDescriptionAllergensPrompt: {
    fontSize: 14,
    textAlign: "center"
  }, 
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
    elevation: 1
  },
  devider: {
    borderLeftColor: "gray",
    borderLeftWidth: 1,
    height: 30,
    marginRight: 10,
    marginLeft: 10
  },
  input: {
    width: 250,
    height: 40
  },
  icons: {
    fontSize: 20,
    color: "#333",
    marginLeft: 10
  },
  loginButton: {
    backgroundColor: "#00FF00",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    borderRadius: 50,
    elevation: 1
  },
  loginText: {
    fontWeight: 'bold',
    color: "white"
  },
  createAccount: {
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    borderRadius: 50,
    elevation: 1,
    marginTop: 10
  },
  createAccountText: {
    fontWeight: 'bold',
  },
  createAccount2: {
    backgroundColor: "#00FF00",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    borderRadius: 50,
    elevation: 1,
    marginTop: 10
  },
  createAccountText2: {
    fontWeight: 'bold',
    color: "white"
  },
  horizontalDevider: {
    borderBottomColor: "grey",
    borderBottomWidth: 1,
    marginTop: 20,
    marginBottom: 20
  },
  googleButton: {
    backgroundColor: "white",
    justifyContent: "flex-start",
    height: 40,
    borderRadius: 10,
    elevation: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10
  },
  buttonIcon: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleIcon: {
    fontSize: 20,
    color: "black"
  },
  googleText: {
    fontWeight: 'bold',
    flex: 1,
    textAlign: "center",
    marginRight: 50
  },
  googleTextCreate: {
    fontWeight: 'bold',
    flex: 1,
    textAlign: "center",
    marginRight: 30
  },
  facebookButton: {
    backgroundColor: "#3B5998",
    justifyContent: "flex-start",
    height: 40,
    borderRadius: 10,
    elevation: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingLeft: 10
  },
  facebookIcon: {
    fontSize: 20,
    color: "white",
  },
  facebookText: {
    fontWeight: 'bold',
    color: "white",
    flex: 1,
    textAlign: "center",
    marginRight: 50
  },
  facebookTextCreate: {
    fontWeight: 'bold',
    color: "white",
    flex: 1,
    textAlign: "center",
    marginRight: 30
  },
  appleButton: {
    backgroundColor: "black",
    justifyContent: "flex-start",
    height: 40,
    borderRadius: 10,
    elevation: 1,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10
  },
  appleIcon: {
    fontSize: 20,
    color: "white",
    marginLeft: 20
  },
  appleText: {
    fontWeight: 'bold',
    color: "white",
    flex: 1,
    textAlign: "center",
    marginRight: 30
  },
  appleTextCreate: {
    fontWeight: 'bold',
    color: "white",
    flex: 1,
    textAlign: "center",
    marginRight: 20
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: "center",
    marginBottom: 20
  },
  resetButton: {
    backgroundColor: "#00FF00",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    borderRadius: 50,
    elevation: 1,
    marginTop: 10,
  },
  resetText: {
    fontWeight: 'bold',
    color: "white",
  },
  resetPasswordButton: {
    marginTop: 10,
    width: 300
  },
  resetPasswordText: {
    color: 'black',
    fontWeight: '100',
    textAlign: 'center',
    textDecorationLine: 'underline'
  },
  passwordsDontMatch: {
    position: "absolute",
    bottom: 20,
    backgroundColor: "red",
    justifyContent: "center",
    alignContent: "center",
    borderRadius: 10,
  },
  passwordsDontMatchText: {
    fontWeight: 'bold',
    color: "white",
    textAlign: "center",
    padding: 5,
  },
  submitButton: {
    backgroundColor: "#00FF00",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    borderRadius: 50,
    elevation: 1,
    marginTop: 10
  },
  submitText: {
    fontWeight: 'bold',
    color: "white"
  },
  emailMessageSuccess: {
    position: "absolute",
    bottom: 20,
    backgroundColor: "green",
    justifyContent: "center",
    alignContent: "center",
    borderRadius: 10,
    height: 59,
    width: 200
  },
  emailMessageError: {
    position: "absolute",
    bottom: 20,
    backgroundColor: "red",
    justifyContent: "center",
    alignContent: "center",
    borderRadius: 10
  },
  emailText: {
    fontWeight: 'bold',
    color: "white",
    textAlign: "center",
    padding: 5
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