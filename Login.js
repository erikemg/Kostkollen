import React, { useEffect, useState, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TextInput } from 'react-native-gesture-handler';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import { NavigationContainer } from "@react-navigation/native";
import { auth, googleProvider } from './firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import CreateAccount from './CreateAccount';
import ForgotPassword from './ForgotPassword';

const LoginScreen = ({ route }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ user, setUser ] = useState(null);
  const { navigate } = useNavigation()
  const [displayError, setDisplayError] = useState("")
  const { infoEntered, setInfoEntered} = route.params
  const slideAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (displayError !== "") {
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
        setDisplayError("");
      });
    }, 2000);
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setInfoEntered(true)
      setUser(auth.currentUser)
    } catch (error) {
      setDisplayError(error.message);
    }
  };
  
  const handleGoogleLogin = () => {
    signInWithPopup(auth, googleProvider)
  .then((result) => {
    setUser(result.user);
  }).catch((error) => {
    setDisplayError(error)
  });
  };

    return (
    <SafeAreaView style={styles.container} behavior="padding">
      <View style={styles.inputContainer}>
        <Text style={styles.header}>Login</Text>
        <View style={styles.textInputContainer}>
          <MaterialCommunityIcons name="account-outline" style={styles.icons} />
          <View style={styles.devider} />
          <TextInput placeholder='Email' onChangeText={(text) => setEmail(text)} style={styles.input}/>
        </View>
        <View style={styles.textInputContainer}>
          <MaterialCommunityIcons name="lock-outline" style={styles.icons} />
          <View style={styles.devider} />
          <TextInput placeholder='Password' onChangeText={(text) => setPassword(text)} secureTextEntry={true} style={styles.input}/>
        </View>
        <TouchableOpacity style={styles.loginButton} onPress={() => handleLogin()}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.createAccount} onPress={() => {navigate("CreateAccount")}}>
          <Text style={styles.createAccountText}>Create account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetPasswordButton} onPress={() => {navigate("ForgotPassword")}}>
          <Text style={styles.resetPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
        <View style={styles.horizontalDevider} />
        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
          <View style={styles.buttonIcon}>
            <AntDesign name="google" style={styles.googleIcon} />
          </View>
          <Text style={styles.googleText}>Sign in with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.facebookButton}>
          <View style={styles.buttonIcon}>
            <MaterialCommunityIcons name="facebook" style={styles.facebookIcon} />
          </View>
          <Text style={styles.facebookText}>Sign in with Facebook</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.appleButton}>
          <View style={styles.buttonIcon}>
            <FontAwesome5 name="apple" style={styles.appleIcon} />
          </View>
          <Text style={styles.appleText}>Sign in with Apple</Text>
        </TouchableOpacity>
      </View>
      {displayError !== "" && (
          <View style={styles.passwordsDontMatch}>
            <Text style={styles.passwordsDontMatchText}>{displayError}</Text>
          </View>
        )}
    </SafeAreaView>
  );
}

const Homestack = createNativeStackNavigator()

export default function LoginStack({ infoEntered, setInfoEntered}) {
  return (
    <NavigationContainer>
      <Homestack.Navigator>
        <Homestack.Screen name="LoginScreen"  initialParams={{infoEntered, setInfoEntered: (info) => setInfoEntered(info)}} component={LoginScreen} options={{ headerShown: false }}/>
        <Homestack.Screen name="CreateAccount" initialParams={{infoEntered, setInfoEntered: (info) => setInfoEntered(info)}} component={CreateAccount} options={{ headerShown: false }}/>
        <Homestack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }}/>
      </Homestack.Navigator>
    </NavigationContainer>
  )
}

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
    fontWeight: "bold",
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
    fontWeight: "bold",
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
    fontWeight: "bold",
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
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    marginRight: 50
  },
  googleTextCreate: {
    fontWeight: "bold",
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
    fontWeight: "bold",
    color: "white",
    flex: 1,
    textAlign: "center",
    marginRight: 50
  },
  facebookTextCreate: {
    fontWeight: "bold",
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
    fontWeight: "bold",
    color: "white",
    flex: 1,
    textAlign: "center",
    marginRight: 30
  },
  appleTextCreate: {
    fontWeight: "bold",
    color: "white",
    flex: 1,
    textAlign: "center",
    marginRight: 20
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
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
    fontWeight: "bold",
    color: "white",
  },
  resetPasswordButton: {
    marginTop: 10,
    width: 300
  },
  resetPasswordText: {
    color: 'black',
    fontWeight: 'thin',
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
    fontWeight: "bold",
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
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    padding: 5
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
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    padding: 5,
  },
});