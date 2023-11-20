import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Modal, Pressable, Image, ActivityIndicator, BackHandler } from 'react-native';
import { auth, usersRef } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { onValue } from '@firebase/database';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { child, update } from "firebase/database";
import { useNavigation } from '@react-navigation/native';
import preferences from './Preferences'

let allergens = {...preferences}

export default function FoodPreferences() {
  const [yourPreferences, setYourPreferences] = useState([]);
  const [morePreferences, setMorePreferences] = useState([]);
  const [yourPreferencesArr, setYourPreferencesArr] = useState([]);
  const [morePreferencesArr, setMorePreferencesArr] = useState([])
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [infoSelector, setInfoSelector] = useState("");
  const navigation = useNavigation();

  minusPlusHandler = (preference, func) => {
    const preferenceValue = allergens[preference].containsStatus;
    const updatedYourPreferencesArr = [...yourPreferencesArr];
    const updatedMorePreferencesArr = [...morePreferencesArr];
            
    if (preferenceValue >= 1) {
      if(func){
        allergens[preference].containsStatus = 0
      }
      updatedYourPreferencesArr.push(preference);
      const index = updatedMorePreferencesArr.indexOf(preference);
      if (index !== -1) {
        updatedMorePreferencesArr.splice(index, 1);
      }
    } else {
      if(func){
        allergens[preference].containsStatus = 1
      }
      updatedMorePreferencesArr.push(preference);
      const index = updatedYourPreferencesArr.indexOf(preference);
      if (index !== -1) {
        updatedYourPreferencesArr.splice(index, 1);
      }
    }
    setYourPreferencesArr(updatedYourPreferencesArr);
    setMorePreferencesArr(updatedMorePreferencesArr);
  }
  
  useEffect(() => {
    if (user) {
      const handleData = (snapshot) => {
        const data = snapshot.val();
        if (data && data[user.uid]) {
          const userAllergens = data[user.uid].allergens;
          
          const allergenKeys = Object.keys(userAllergens);
    
          allergenKeys.forEach((preference) => {
            const allergenValue = userAllergens[preference];
            allergens[preference].containsStatus = allergenValue;

            minusPlusHandler(preference, false)
          });
        }
        
        setLoading(false);
      };
    
      onValue(usersRef, handleData);
    }
  }, [user]);
  

  useEffect(() => {
    let updatedYourPreferences = [];
    let updatedMorePreferences = [];
  
    const iconTemplate = (iconName) => (
      <View style={styles.greenIconContainer}>
        <MaterialCommunityIcons name={iconName} size={30} color="white" />
      </View>
    );
  
    Object.keys(allergens).forEach((preference) => {
      const allergenValue = allergens[preference].containsStatus;
      let iconName = null;
      switch (preference) {
        case "gluten":
          iconName = "barley"
          break;
        case "dairy":
          iconName = "cup-water"
          break;
        case "nuts":
          iconName = "peanut"
          break;
        case "seafood":
          iconName = "fish"
          break;
        case "vegan":
          iconName = "sprout"
          break;
        case "vegetarian":
          iconName = "leaf"
          break;
        case "sugar":
          iconName = "cube-outline"
          break;
        case "keto":
          iconName = "food-steak"
          break;
        case "eggs":
          iconName = "egg"
          break;
      }
      const icon = iconTemplate(iconName)
  
      const preferenceContainer = (
        <View style={styles.preferenceContainer} key={allergens[preference].title}>
          <View style={styles.titleIconContainer}>
            {icon}
            <Text style={styles.preferenceText}>{allergens[preference].title}</Text>
            <TouchableOpacity
                onPress={() => {
                  setInfoSelector(preference);
                }}
                style={styles.infoButton}
              >
                <Text style={styles.infoButtonText}>i</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.button} onPress={() => minusPlusHandler(preference, true)}>
            <MaterialCommunityIcons name={allergenValue >= 1 ? 'minus-circle-outline' : 'plus-circle-outline'} size={25}/>
          </TouchableOpacity>
        </View>
      );
  
      if (allergenValue >= 1) {
        updatedYourPreferences.push(preferenceContainer);
      } else {
        updatedMorePreferences.push(preferenceContainer);
      }
  
      allergens[preference].containsStatus = allergenValue;
    });
    if(updatedYourPreferences.length === 0) {
      updatedYourPreferences.push(
        <View style={styles.noMoreContainer}>
          <Text style={styles.noMoreText}>Du har inte valt några preferencer</Text>
        </View>
      );
    } else if (updatedMorePreferences.length === 0){
      updatedMorePreferences.push(
        <View style={styles.noMoreContainer}>
          <Text style={styles.noMoreText}>Det finns inga fler preferencer</Text>
        </View>
      );
    }
    setYourPreferences(updatedYourPreferences)
    setMorePreferences(updatedMorePreferences)
  }, [yourPreferencesArr, morePreferencesArr]);
  

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (user) => {setUser(user)})
  }, [])

  const addPreferencesToDb = async () => {
    if (user) {
      const userPreferences = {
        gluten: allergens.gluten.containsStatus,
        dairy: allergens.dairy.containsStatus,
        nuts: allergens.nuts.containsStatus,
        seafood: allergens.seafood.containsStatus,
        vegetarian: allergens.vegetarian.containsStatus,
        vegan: allergens.vegan.containsStatus,
        sugar: allergens.sugar.containsStatus,
        keto: allergens.keto.containsStatus,
        eggs: allergens.eggs.containsStatus
      };
      
      const userRef = child(usersRef, user.uid);
      const userAllergensRef = child(userRef, 'allergens');
      await update(userAllergensRef, userPreferences);
    }
  };

  useEffect(() => {
    if(user) {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        addPreferencesToDb();
        return false;
      });
  
      const navigationBackListener = navigation.addListener('beforeRemove', (e) => {
        e.preventDefault();
        addPreferencesToDb();
        navigation.dispatch(e.data.action);
      });
  
      return () => {
        backHandler.remove();
        navigationBackListener();
      };
    }
  }, [navigation, user]);

  return (
    <ScrollView style={styles.container}>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="green" />
        </View>
      ) : (
        <View>
          <View style={styles.headerContainer}>
            <Text style={styles.text}>Dina matpreferenser</Text>
          </View>
          {yourPreferences}
          <View style={styles.headerContainer}>
            <Text style={styles.text}>Fler matpreferenser</Text>
          </View>
          {morePreferences}
          {infoSelector !== '' && (
            <Modal visible={true} animationType="fade" transparent>
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>{allergens[infoSelector].title}</Text>
                  <Text style={styles.modalDescription}>
                    {allergens[infoSelector].desc}
                  </Text>
                  <TouchableOpacity onPress={() => setInfoSelector('')} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Stäng</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({ 
  greenIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "center",
    backgroundColor: 'green',
    borderRadius: 50,
    marginLeft: 3,
    marginTop: 3,
    height: 40,
    width: 40
  },
  titleIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  text: {
    fontSize: 17,
    fontWeight: '600'
  },
  headerContainer: {
    padding: 5,
    marginLeft: 10
  },
  preferenceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginVertical: 2,
    marginHorizontal: 10,
    paddingHorizontal: 10,
  },
  preferenceText: {
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 10
  },
  button: {
    marginRight: 10
  },
  noMoreContainer: {
    flexDirection: 'row',
    paddingLeft: 15,
  },
  infoButton: {
    backgroundColor: '#333',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5
  },
  infoButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
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
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: "center"
  },
  addFoodButton: {
    backgroundColor: '#00FF00',
    borderRadius: 50,
    width: 200,
    height: 50,
    justifyContent: "center"
  },
  addFoodButtonContainer: {
    marginTop: 20,
    width: "100%",
    alignItems: 'center',
  },
});