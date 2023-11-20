import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Modal, ScrollView, Pressable, BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import InfoModal from './InfoModal';
import preferences from './Preferences'
import CodeScanner from './BarcodeScannerAdd';

let allergens = {...preferences}

Object.values(allergens).forEach((allergen) => {
  allergen.containsStatus = -1;
});

const AllergenContainers = ({ setShowInfo, openInfo }) => {
  const [activeButtonIndex, setActiveButtonIndex] = useState({});

  return (
    Object.keys(allergens).map((allergyKey, index) => {
      const allergy = allergens[allergyKey];

      const handleButtonPress = (status, groupIndex) => {
        allergens[allergyKey].containsStatus = status;
        allergens[allergyKey].infoEntered = true;
        activeButtonVar = {...activeButtonIndex}
        activeButtonVar[groupIndex] = status
        setActiveButtonIndex(activeButtonVar);
      };

      let iconName = null;
      switch (allergyKey) {
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
        <View style={styles.allergyContainer} key={allergy.title}>
          <View style={styles.allergyHeader}>
            <Text style={styles.smallHeader}>{allergy.title}</Text>
            <TouchableOpacity onPress={() => { setShowInfo(true); openInfo(allergyKey) }} style={styles.infoButton}>
              <Text style={styles.infoButtonText}>i</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <Pressable onPress={() => handleButtonPress(2, index)}>
              <View style={activeButtonIndex[index] === 2 ? styles.greenIconContainer : styles.greenIconContainerInactive} />
              <View style={styles.iconWrapper}>
                  <MaterialCommunityIcons name={iconName} size={50} color="white" />
              </View>
            </Pressable>
            <Pressable onPress={() => handleButtonPress(1, index)}>
              <View style={activeButtonIndex[index] === 1 ? styles.yellowIconContainer : styles.yellowIconContainerInactive} />
              <View style={styles.iconWrapper}>
                  <MaterialCommunityIcons name={iconName} size={50} color="white" />
              </View>
            </Pressable>
            <Pressable onPress={() => handleButtonPress(0, index)}>
              <View style={activeButtonIndex[index] === 0 ? styles.redIconContainer : styles.redIconContainerInactive} />
              <View style={styles.iconWrapper}>
                  <MaterialCommunityIcons name={iconName} size={50} color="white" />
              </View>
            </Pressable>
          </View>
        </View>
      );
    })
  );
};


export default function AddFoodScreen({ route }) {
  const [showInfo, setShowInfo] = useState(false);
  const [showInfoAll, setShowInfoAll] = useState(false)
  const [infoSelector, setInfoSelector] = useState("");
  const [foodName, setFoodName] = useState("")
  const [brandName, setBrandName] = useState("")
  const [barcode, setBarcode] = useState("")
  const [ingredients, setIngredients] = useState("")
  const [calories, setCalories] = useState("")
  const [fat, setFat] = useState("")
  const [carbs, setCarbs] = useState("")
  const [sugar, setSugar] = useState("")
  const [protein, setProtein] = useState("")
  const [scannerOpen, setScannerOpen] = useState(false)
  const [openPrompt, setOpenPrompt] = useState(false)
  const [overrideEntered, setOverrideEntered] = useState(false)
  const [openPromptRequired, setOpenPromptRequired ] = useState(false)
  const { barcodeInitial } = route.params

  const navigation = useNavigation();

  const openInfo = (allergyKey) => {
    setShowInfo(true);
    setInfoSelector(allergyKey);
  };

  const overrideEnteredFunc = () => {
    setOverrideEntered(true);
  }

  const showAlert = () => {
    setOpenPromptRequired(true)
  }

  const spaceApiConvert = (text) => {
    if (typeof text === 'undefined') {
      return '';
    }
  
    const textArr = text.split('');
    const newArr = textArr.map((element, index) => {
      if (element === ' ') {
        return '%20';
      } else {
        return element;
      }
    });
    const newStr = newArr.join('');
    return newStr;
  };
  
  useEffect(() => {
    if (overrideEntered) {
      handleCreateFood();
    }
  }, [overrideEntered]);
  
  useEffect(() => {
    if (barcodeInitial != null) {
      setBarcode(barcodeInitial);
    }
  }, []);

  useEffect(() => {
    if(barcodeInitial) {
        const onBackPress = () => {
          navigation.navigate('CodeScanner')
          return true
        };
  
        const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
  
        return () => subscription.remove();
    }}, [])

  const handleCreateFood = () => {
    if (false) {
      showAlert()
    } else {
    fetch(`https://world.openfoodfacts.org/cgi/product_jqm2.pl?code=${barcode}&user_id=erigor0503&password=IUsedToBench405&product_name=${spaceApiConvert(foodName)}&brands=${spaceApiConvert(brandName)}&ingredients_text=${spaceApiConvert(ingredients)}&nutriment_energy=${calories}&nutriment_energy_unit=kcal&nutriment_fat=${fat}&nutriment_carbohydrates=${carbs}&nutriment_protein=${protein}&nutriment_sugar=${sugar}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
    .then(response => response.json())
    .then(data => {
        console.log("Data", data);
    })
    .catch(error => {
        console.error("Erorr :", error);
    });
      if(barcodeInitial) {
        navigation.navigate('CodeScanner');
      } else {
        navigation.goBack()
      }
    }
  }

  if(scannerOpen) {
    return <CodeScanner setBarcode={(data) => setBarcode(data)} setScannerOpen={(data) => setScannerOpen(data)} />
  } else {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.shadowContainer}>
          <View>
            <Text style={styles.header}>Matnamn</Text>
            <TextInput placeholder="Ange matnamnet" style={styles.inputField} onChangeText={(text) => setFoodName(text)}/>
          </View>
          <View>
            <Text style={styles.header}>Märkesnamn</Text>
            <TextInput placeholder="Ange märkesnamnet" style={styles.inputField} onChangeText={(text) => setBrandName(text)}/>
          </View>
          <View>
            <Text style={styles.header}>Streckkod</Text>
            <TextInput placeholder="Ange streckkoden" style={styles.inputField} onChangeText={(text) => setBarcode(text)} value={barcode}></TextInput>
            <TouchableOpacity style={styles.cameraContainer} onPress={() => setScannerOpen(true)}>
              <MaterialCommunityIcons name="scan-helper" color="green" size={25}/>
            </TouchableOpacity>
          </View>
          <View>
            <Text style={styles.header}>Ingredienser</Text>
            <TextInput placeholder="Ange ingredienserna" style={styles.inputField} onChangeText={(text) => setIngredients(text)} value={ingredients}/>
          </View>
          <View>
            <Text style={styles.header}>Näringsvärde per 100g</Text>
            <View style={styles.nutrimentContainer}>
              <Text style={styles.smallHeader}>Kcal</Text>
              <TextInput placeholder="Ange Kcal" style={styles.nutrimentInput} onChangeText={(text) => setCalories(text)} value={calories}/>
            </View>
            <View style={styles.nutrimentContainer}>
              <Text style={styles.smallHeader}>Fett</Text>
              <TextInput placeholder="Ange Fett" style={styles.nutrimentInput} onChangeText={(text) => setFat(text)} value={fat}/>
            </View>
            <View style={styles.nutrimentContainerCarbs}>
              <Text style={styles.smallHeader}>Kolhydrater</Text>
              <TextInput placeholder="Ange Kolhydrater" style={styles.nutrimentInput} onChangeText={(text) => setCarbs(text)} value={carbs}/>
            </View>
            <View style={styles.nutrimentContainerSugar}>
              <Text style={styles.smallHeader}>Varav sockerarter</Text>
              <TextInput placeholder="Ange Sockerarter" style={styles.nutrimentInput} onChangeText={(text) => setSugar(text)} value={sugar}/>
             </View>
            <View style={styles.nutrimentContainer}>
              <Text style={styles.smallHeader}>Protein</Text>
              <TextInput placeholder="Ange Protein" style={styles.nutrimentInput} onChangeText={(text) => setProtein(text)} value={protein}/>
            </View>
          </View>
          <View style={styles.hidden}>
            <View style={styles.allergenInfoHeader}>
              <Text style={styles.smallHeader}>Allergeninformation</Text>
              <TouchableOpacity onPress={() => { setShowInfoAll(true) }} style={styles.infoButton}>
                <Text style={styles.infoButtonText}>i</Text>
              </TouchableOpacity>
            </View>
            <AllergenContainers setShowInfo={setShowInfo} openInfo={openInfo} />
          </View>
          <View style={styles.addFoodButtonContainer}>
          <TouchableOpacity onPress={handleCreateFood} style={styles.addFoodButton}>
            <Text style={styles.addFoodText}>Skapa mat</Text>
          </TouchableOpacity>
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
        <Modal visible={openPrompt} animationType="fade" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalDescriptionAllergensPrompt}>
                  Du har inte angett information för några av allergenerna/matpreferenserna, vill du lägga till den saknade informationen?
              </Text>
              <View style={styles.buttonContainerAleart}>
                <TouchableOpacity onPress={() => overrideEnteredFunc()} style={styles.dismissButton}>
                  <Text style={styles.dismissButtonText}>Avvisa</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setOpenPrompt(false)} style={styles.enterInfoButton}>
                  <Text style={styles.enterInfoButtonText}>Ange info</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <Modal visible={openPromptRequired} animationType="fade" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalDescription}>
                  Du måste ange info i alla fälten
              </Text>
              <View style={styles.buttonContainerAleart}>
                <TouchableOpacity onPress={() => setOpenPromptRequired(false)} style={styles.enterInfoButton}>
                  <Text style={styles.enterInfoButtonText}>Ange info</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        {showInfoAll && 
         <InfoModal setShowInfo={info => setShowInfoAll(info)} />
         }
      </ScrollView>
    );
  }
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
  redIconContainer: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    width: 70,
    height: 70,
    margin: 5
  },
  greenIconContainer: {
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    width: 70,
    height: 70,
    margin: 5
  },
  yellowIconContainer: {
    backgroundColor: '#ffee00',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    width: 70,
    height: 70,
    margin: 5
  },
  redIconContainerInactive: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    width: 70,
    height: 70,
    opacity: 0.1,
    margin: 5
  },
  greenIconContainerInactive: {
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    width: 70,
    height: 70,
    opacity: 0.1,
    margin: 5
  },
  yellowIconContainerInactive: {
    backgroundColor: '#ffee00',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    width: 70,
    height: 70,
    opacity: 0.1,
    margin: 5
  },
  allergenInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5
  },
  iconWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    margin: 'auto',
    justifyContent: 'center',
    alignItems: 'center'
  },
  nutrimentContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 5,
    paddingBottom: 5,
    alignItems: 'center',
    justifyContent: "space-between",
    borderBottomColor: "#333",
    borderBottomWidth: 1
  },
  nutrimentContainerCarbs: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 5,
    paddingBottom: 5,
    alignItems: 'center',
    justifyContent: "space-between",
  },
  nutrimentContainerSugar: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 20,
    paddingBottom: 5,
    alignItems: 'center',
    justifyContent: "space-between",
    borderBottomColor: "#333",
    borderBottomWidth: 1
  },
  nutrimentInput: {
    paddingTop: 10,
    width: 150
  },
  hidden: {
    display: "none"
  },
  cameraContainer: {
    flex: 1,
    flexDirection: "row",
    width: 300,
    height: 30,
    justifyContent: "flex-end",
    marginTop: -57,
    marginBottom: 30
  }
});