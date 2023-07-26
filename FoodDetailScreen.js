import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Modal, ScrollView, Pressable, Image, Alert } from 'react-native';
import { child, update, onValue } from '@firebase/database';
import { foodsInDb } from './firebase';
import { useNavigation, CommonActions } from '@react-navigation/native';

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

const AllergenContainers = ({ setShowInfo, openInfo, allergensContainsInfo }) => {
  return (
    Object.keys(allergens).map((allergyKey) => {
      const containsStatus = allergensContainsInfo[allergyKey];

      let iconSource;
      switch(containsStatus) {
        case 0:
          iconSource = require('./Icons/Redcross.png');
          break;
        case 1:
          iconSource = require('./Icons/Yellowminus.png');
          break;
        case 2:
          iconSource = require('./Icons/Greencheck.png');
          break;
        default:
          iconSource = null;
          break;
      }

      return (
        <View style={styles.allergyContainer} key={allergens[allergyKey].title}>
          <View style={styles.allergyHeader}>
            <Text style={styles.smallHeader}>{allergens[allergyKey].title}</Text>
            <TouchableOpacity onPress={() => { setShowInfo(true); openInfo(allergyKey) }} style={styles.infoButton}>
              <Text style={styles.infoButtonText}>i</Text>
            </TouchableOpacity>
          </View>
          {iconSource && <Image style={styles.iconActive} source={iconSource} />}
        </View>
      );
    })
  );
};


export default function FoodDetailScreen({ route }) {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [foodObject, setFoodObject] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [infoSelector, setInfoSelector] = useState("");
  const [prompt, setPrompt] = useState(false)
  const {foodName, brandName, allergensContainsInfo, foodId, barcode, setBarcode, isFocused } = route.params
  const { navigate } = useNavigation()

  const openInfo = (allergyKey) => {
    setShowInfo(true);
    setInfoSelector(allergyKey);
  };

  const handleBindBarcode = () => {
    const foodRef = child(foodsInDb, foodId);
    const newFoodObj = { ...foodObject };
    newFoodObj.barcode = barcode
    update(foodRef, newFoodObj);
    setPrompt(true)
    navigate('CodeScanner')
  }
  
  useEffect(() => {
    const handleDbInfo = (snapshot) => {
      const snapshotVal = snapshot.val();
      setFoodObject(snapshotVal[foodId]);
      setDataLoaded(true);
    };
  
    onValue(foodsInDb, handleDbInfo);
  
    if (dataLoaded && foodObject) {
      const foodRef = child(foodsInDb, foodId);
      const newFoodObj = { ...foodObject };
      newFoodObj.timesClicked = (foodObject.timesClicked || 0) + 1;
      update(foodRef, newFoodObj);
    }
  }, [dataLoaded, foodId]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.shadowContainer}>
        <View>
          <Text style={styles.smallHeader}>Food Name</Text>
          <Text style={styles.header}>{foodName}</Text>
        </View>
        <View>
          <Text style={styles.smallHeader}>Food Brand</Text>
          <Text style={styles.header}>{brandName}</Text>
        </View>
        <View>
          <Text style={styles.smallHeader}>Allergen Info</Text>
          <AllergenContainers setShowInfo={setShowInfo} openInfo={openInfo} foodName={foodName} brandName={brandName} allergensContainsInfo={allergensContainsInfo}/>
          {barcode && <View style={styles.bindBarcodeButtonContainer}>
            <Text style={styles.bindBarcodeDescription}>Do you want to link the barcode you scanned to this food?</Text>
            <TouchableOpacity style={styles.bindBarcodeButton}>
              <Text style={styles.bindBarcodeText} onPress={handleBindBarcode}>Link barcode</Text>
            </TouchableOpacity>
        </View>}
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
      <Modal visible={prompt} animationType="fade" transparent>
        <View style={styles.boundContainer}>
        <View style={styles.boundMessageSuccess}>
        <Text style={styles.boundSuccessText}>The barcode was linked to the item</Text>
      </View>
        </View>
       </Modal>
    </ScrollView>
  );
};

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
  bindBarcodeButton: {
    backgroundColor: '#00FF00',
    borderRadius: 50,
    width: 150,
    height: 50,
    justifyContent: "center"
  },
  bindBarcodeButtonContainer: {
    marginTop: 20,
    width: "100%",
    alignItems: 'center',
  },
  bindBarcodeText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: "center",
    color: "white"
  },
  bindBarcodeDescription: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '600'
  },
  boundMessageSuccess: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    backgroundColor: 'green',
    marginHorizontal: 30,
    borderRadius: 10
  },
  boundSuccessText: {
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    padding: 5,
  },
  boundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});