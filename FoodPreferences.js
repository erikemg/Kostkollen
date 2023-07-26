import React, { useState, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View, ScrollView, Modal, Pressable, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput } from 'react-native-gesture-handler';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { auth, usersRef } from './firebase';
import { createUserWithEmailAndPassword, sendEmailVerification, onAuthStateChanged } from 'firebase/auth';
import { onValue } from '@firebase/database';
import { useNavigation } from '@react-navigation/native';
import { child, update } from "firebase/database";


let allergens = {
    gluten: {
      title: "Gluten Free",
      desc: "Gluten is a protein found in wheat, barley, and rye. It is commonly found in foods like bread, pasta, and baked goods.",
      containsStatus: 0,
      infoEntered: false
    },
    dairy: {
      title: "Dairy Free",
      desc: "Dairy products include milk, cheese, butter, and yogurt. They are a common source of lactose, which may cause intolerance or allergies in some individuals.",
      containsStatus: 0,
      infoEntered: false
    },
    nuts: {
      title: "Free from Nuts",
      desc: "Nuts such as peanuts, almonds, walnuts, and cashews are a common allergen. They can be found in various food products, including snacks, desserts, and sauces.",
      containsStatus: 0,
      infoEntered: false
    },
    seafood: {
      title: "Free from Seafood",
      desc: "Seafood allergies are typically associated with fish (such as salmon, tuna, and cod) and shellfish (such as shrimp, lobster, and crab). Allergic reactions can range from mild to severe.",
      containsStatus: 0,
      infoEntered: false
    },
    vegetarian: {
      title: "Vegetarian",
      desc: "Vegetarianism involves abstaining from consuming meat, poultry, and seafood. Vegetarians may still consume dairy products and eggs.",
      containsStatus: 0,
      infoEntered: false
    },
    vegan: {
      title: "Vegan",
      desc: "Veganism is a plant-based diet that excludes all animal products, including meat, poultry, seafood, dairy, and eggs. It is also a lifestyle that avoids the use of any animal-derived products.",
      containsStatus: 0,
      infoEntered: false
    },
  };

  const AllergenContainers = ({ setShowInfo, openInfo }) => {
    const [activeButtonIndex, setActiveButtonIndex] = useState({});
  
    useEffect(() => {
      const initialActiveButtonIndex = {};
      Object.keys(allergens).forEach((allergyKey) => {
        const containsStatus = allergens[allergyKey].containsStatus;
        initialActiveButtonIndex[allergyKey] = containsStatus;
      });
      setActiveButtonIndex(initialActiveButtonIndex);
    }, []);
  
    useEffect(() => {
      const updatedActiveButtonIndex = { ...activeButtonIndex };
      Object.keys(allergens).forEach((allergyKey) => {
        const containsStatus = allergens[allergyKey].containsStatus;
        updatedActiveButtonIndex[allergyKey] = containsStatus;
      });
      setActiveButtonIndex(updatedActiveButtonIndex);
    }, [allergens]);
  
    const handleButtonPress = (status, allergyKey) => {
      const updatedActiveButtonIndex = { ...activeButtonIndex };
      updatedActiveButtonIndex[allergyKey] = status;
      setActiveButtonIndex(updatedActiveButtonIndex);
      allergens[allergyKey].containsStatus = status;
    };
  
    return (
      Object.keys(allergens).map((allergyKey) => {
        const allergy = allergens[allergyKey];
  
        return (
          <View style={styles.allergyContainer} key={allergy.title}>
            <View style={styles.allergyHeader}>
              <Text style={styles.smallHeader}>{allergy.title}</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowInfo(true);
                  openInfo(allergyKey);
                }}
                style={styles.infoButton}
              >
                <Text style={styles.infoButtonText}>i</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
              <Pressable
                onPress={() => handleButtonPress(2, allergyKey)}
              >
                <Image
                  style={
                    activeButtonIndex[allergyKey] === 2
                      ? styles.iconActive
                      : styles.icon
                  }
                  source={require('./Icons/Greencheck.png')}
                />
              </Pressable>
              <Pressable
                onPress={() => handleButtonPress(1, allergyKey)}
              >
                <Image
                  style={
                    activeButtonIndex[allergyKey] === 1
                      ? styles.iconActive
                      : styles.icon
                  }
                  source={require('./Icons/Yellowminus.png')}
                />
              </Pressable>
              <Pressable
                onPress={() => handleButtonPress(0, allergyKey)}
              >
                <Image
                  style={
                    activeButtonIndex[allergyKey] === 0
                      ? styles.iconActive
                      : styles.icon
                  }
                  source={require('./Icons/Redcross.png')}
                />
              </Pressable>
            </View>
          </View>
        );
      })
    );
  };
  
  
export default function FoodPreferences() {
    const [showInfo, setShowInfo] = useState(false);
    const [infoSelector, setInfoSelector] = useState("");
    const [ user, setUser ] = useState(auth.currentUser);
    const [loading, setLoading] = useState(true);

  
    const openInfo = (allergyKey) => {
      setShowInfo(true);
      setInfoSelector(allergyKey);
    };
  

    useEffect(() => {
      const handleData = (snapshot) => {
        const data = snapshot.val();
        if (data && data[user.uid]) {
          const userAllergens = data[user.uid];
          Object.keys(userAllergens).forEach((allergen) => {
            allergens[allergen].containsStatus = userAllergens[allergen];
          });
        }
        setLoading(false);
      };
    
      onValue(usersRef, handleData);
      }, []);

    useEffect(() => {
      const unSubscribe = onAuthStateChanged(auth, (user) => {setUser(user)})
    }, [])  

    const addPreferencesToDb = async () => {
      const userPreferences = {
        gluten: allergens.gluten.containsStatus,
        dairy: allergens.dairy.containsStatus,
        nuts: allergens.nuts.containsStatus,
        seafood: allergens.seafood.containsStatus,
        vegetarian: allergens.vegetarian.containsStatus,
        vegan: allergens.vegan.containsStatus
      };
      const userRef = child(usersRef, user.uid);
      await update(userRef, userPreferences);
    };
  
    const handleUpdatePreferences = () => {
        addPreferencesToDb()
    }
    if (loading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="green" />
        </View>
      );
    } else {return (
      <ScrollView>
        <View style={styles.shadowContainer}>
          <View>
            <Text style={styles.header}>How would you like your foods?</Text>
            <AllergenContainers setShowInfo={setShowInfo} openInfo={openInfo} />
          </View>
          <View style={styles.addFoodButtonContainer}>
          <TouchableOpacity onPress={handleUpdatePreferences} style={styles.addFoodButton}><Text style={styles.addFoodText}>Save prefrences</Text></TouchableOpacity>
          </View>
        </View>
  
        {infoSelector !== "" && (
          <Modal visible={showInfo} animationType="fade" transparent>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>{allergens[infoSelector].title}</Text>
                <Text style={styles.modalDescription}>
                  {allergens[infoSelector].desc}
                </Text>
                  <TouchableOpacity onPress={() => setShowInfo(false)} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
      </ScrollView>
    );
  };
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
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });