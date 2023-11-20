import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome';
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './firebase';
import { signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FoodPreferences from "./FoodPreferences";

const Homestack = createNativeStackNavigator()

const SettingsScreen = ({ route }) => {
  const [user, setUser] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const { navigate } = useNavigation();
  const [openPrompt, setOpenPrompt] = useState(false);
  const { setInfoEntered, setVerified } = route.params;

  const logOut = () => {
    signOut(auth);
    setInfoEntered(false);
    setVerified(false);
  };

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (user) => { setUser(user); setUserEmail(user?.email) });
    return unSubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.user}>
        <FontAwesome5 name="user-circle" style={styles.userIcon}/>
        <Text style={styles.userEmail}>{userEmail}</Text>
      </View>
      <View>
        <Text style={styles.header}>Konto</Text>
      </View>
        <TouchableOpacity style={styles.foodPreferencesContainer} onPress={() => navigate("FoodPreferences")}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingName}>Matpreferenser</Text>
          </View>
          <FontAwesome5 name="angle-right" style={styles.arrowIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.logOutContainer} onPress={() => setOpenPrompt(true)}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.logOut}>Logga ut</Text>
          </View>
        </TouchableOpacity>
      <Modal visible={openPrompt} animationType="fade" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalDescription}>
                Vill du verkligen logga ut?
            </Text>
            <View style={styles.buttonContainerAlert}>
              <TouchableOpacity onPress={() => logOut()} style={styles.dismissButton}>
                <Text style={styles.dismissButtonText}>Logga ut</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setOpenPrompt(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Stäng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default function SettingsStack({ route }) {
  const { setInfoEntered, setVerified } = route.params;
  return (
    <Homestack.Navigator initialRouteName="SettingsScreen">
      <Homestack.Screen options={{ headerTitle: "Inställningar" }} name="SettingsScreen" component={SettingsScreen} initialParams={{ setInfoEntered, setVerified }} />
      <Homestack.Screen name="FoodPreferences" options={{ headerTitle: "Matpreferenser" }} component={FoodPreferences} />
    </Homestack.Navigator>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  settingContainer: {
    height: 60,
    width: "100%",
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: "#949494",
    borderTopColor: "#949494",
    borderBottomWidth: 1
  },
  logOutContainer: {
    height: 60,
    width: "100%",
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: "#949494",
    borderTopColor: "#949494",
  },
  foodPreferencesContainer: {
    height: 60,
    width: "100%",
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: "#949494",
    borderTopColor: "#949494",
    borderBottomWidth: 1
  },
  settingTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  settingName: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'left',
  },
  arrowIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  user: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: 'white',
  },
  userIcon: {
    fontSize: 100,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userEmail: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  header: {
    textAlign: "left",
    width: "100%",
    marginLeft: 10,
    marginTop: 10,
    fontSize: 15
  },
  logOut: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'left',
    color: "red"
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
  closeButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  dismissButton: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  dismissButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonContainerAlert: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },
});