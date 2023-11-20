import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Modal, ScrollView} from 'react-native';
import { child, update, onValue } from '@firebase/database';
import { foodsInDb } from './firebase';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import InfoModal from './InfoModal';
import preferences from './Preferences'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-7402081473871492/8813220240';

let allergens = {...preferences}

const AllergenContainers = ({ openInfo, allergensContainsInfo }) => {
  const getIconContainerStyle = (containsStatus) => {
    switch (containsStatus) {
      case -1: 
        return styles.greyIconContainer;
      case 0:
        return styles.redIconContainer;
      case 1:
        return styles.yellowIconContainer;
      case 2:
        return styles.greenIconContainer;
      default:
        return null;
    }
  };
  return (
    Object.keys(allergens).map((preference) => {
      const containsStatus = allergensContainsInfo[preference];

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

      return (
        <View style={styles.allergyContainer} key={allergens[preference].title}>
          <View style={styles.allergyHeader}>
            <Text style={styles.smallHeader}>{allergens[preference].title}</Text>
            <TouchableOpacity onPress={() => { openInfo(preference) }} style={styles.infoButton}>
              <Text style={styles.infoButtonText}>i</Text>
            </TouchableOpacity>
          </View>
          {iconName && 
          <View style={getIconContainerStyle(containsStatus)}>
            <MaterialCommunityIcons name={iconName} size={50} color="white" />
          </View>}
        </View>
      );
    })
  );
};


export default function FoodDetailScreen({ route }) {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [foodObject, setFoodObject] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [showInfoAll, setShowInfoAll] = useState(false);
  const [infoSelector, setInfoSelector] = useState("");
  const [prompt, setPrompt] = useState(false)
  const {foodName, brandName, allergensContainsInfo, foodId, verified, barcode } = route.params
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
        <View style={styles.nameAndVerified}>
          <View>
            <Text style={styles.smallHeader}>Matnamn</Text>
            <Text style={styles.header}>{foodName}</Text>
          </View>
          {verified && <MaterialIcons style={styles.verifiedIcon} name="verified-user" size={30}/> }
        </View>
        <View>
          <Text style={styles.smallHeader}>Märke</Text>
          <Text style={styles.header}>{brandName}</Text>
        </View>
        <BannerAd
      unitId={adUnitId}
      size={BannerAdSize.BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
      }}
    />
        <View>
          <View style={styles.allergenInfoHeader}>
            <Text style={styles.smallHeader}>Allergeninformation</Text>
            <TouchableOpacity onPress={() => { setShowInfoAll(true) }} style={styles.infoButton}>
              <Text style={styles.infoButtonText}>i</Text>
            </TouchableOpacity>
          </View>
          <AllergenContainers openInfo={openInfo} foodName={foodName} brandName={brandName} allergensContainsInfo={allergensContainsInfo}/>
          {false && <View style={styles.bindBarcodeButtonContainer}>
            <Text style={styles.bindBarcodeDescription}>Vill du koppla den skannade streckkoden till det här livsmedlet?</Text>
            <TouchableOpacity style={styles.bindBarcodeButton}>
              <Text style={styles.bindBarcodeText} onPress={handleBindBarcode}>Koppla streckkod</Text>
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
                  <Text style={styles.closeButtonText}>Stäng</Text>
                </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
      <Modal visible={prompt} animationType="fade" transparent>
        <View style={styles.boundContainer}>
        <View style={styles.boundMessageSuccess}>
        <Text style={styles.boundSuccessText}>Streckkoden kopplades till livsmedlet</Text>
      </View>
        </View>
       </Modal>
       {showInfoAll && 
       <InfoModal setShowInfo={info => setShowInfoAll(info)} />
       }
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
    width: 170,
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
  },
  redIconContainer: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    width: 70,
    height: 70
  },
  greyIconContainer: {
    backgroundColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    width: 70,
    height: 70
  },
  greenIconContainer: {
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    width: 70,
    height: 70
  },
  yellowIconContainer: {
    backgroundColor: '#ffee00',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    width: 70,
    height: 70
  },
  allergenInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5
  },
  nameAndVerified: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  verifiedIcon: {
    color: 'green',
    paddingRight: 10
  }
});