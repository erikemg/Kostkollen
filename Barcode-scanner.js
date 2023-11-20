import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ActivityIndicator, Modal, TouchableOpacity, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import FoodDetailScreen from './FoodDetailScreen';
import SearchStack from './Search';

const CodeScanner = ({ route, navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [prompt, setPrompt] = useState(false);
  const [error, setError] = useState('');
  const [openError, setOpenError] = useState(false);
  const [wrongType, setWrongType] = useState(false);
  const [scanned, setScanned] = useState(false);
  const { setBarcode, isFocused } = route.params;
  const { navigate } = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setScanned(false);
      setHasPermission(null);
      (async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === "granted");
      })();
    });

    return unsubscribe;
  }, [navigation]);

  const searchFoodByData = async (data) => {
    await fetch(`https://world.openfoodfacts.net/api/v2/product/${data}?fields=product_name,attribute_groups_en,nutriments,brands,data_sources`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          setPrompt(true)
        }
      })
      .then((data) => {
        if(data.product != null) { 
        const product = data.product || {};
        const product_name = product.product_name || "N/A";
        const attribute_groups = product.attribute_groups_en || "N/A";
        const nutrition_info = product.nutriments || {};
        const brands = product.brands || "N/A"
        const data_sources = product.data_sources || null
        let verified = null

        if (data_sources) {
          let sources = data_sources.split(",");
          if (sources.includes(" Producers")) {
            verified = true
          } else {
            verified = false
          }
        }

        const getKeto = (carbs) => {
          if (carbs <= 0) {
            return 2
          } else {
            return 0
          }
        }

        const toInt = (letter) => {
          switch (letter) {
            case "unknown":
              return -1
              break;
            case "e":
              return 0
              break;
            case "d":
              return 1
              break;
            case "c":
              return 1
              break;
            case "b":
              return 1
              break;
            case "a":
              return 2
              break;
          }
        }

        if(attribute_groups != "N/A") {
          allergensObj = {
            dairy: toInt(attribute_groups[1].attributes[1].grade),
            eggs: toInt(attribute_groups[1].attributes[2].grade),
            gluten: toInt(attribute_groups[1].attributes[0].grade),
            keto: getKeto(nutrition_info.carbohydrates_value),
            nuts: toInt(attribute_groups[1].attributes[3].grade),
            seafood: toInt(attribute_groups[1].attributes[10].grade),
            sugar: toInt(attribute_groups[1].attributes[3].grade),
            vegan: toInt(attribute_groups[2].attributes[0].grade),
            vegetarian: toInt(attribute_groups[2].attributes[1].grade)
          }
        }

        navigate('FoodDetailScreen', {
          foodName: product_name,
          brandName: brands,
          allergensContainsInfo: allergensObj,
          verified: verified,
          options: {
            headerTitle: 'Food Details',
            headerStyle: {
              backgroundColor: '#f4511e',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          },
        });
        setScanned(false);
        setBarcode('');
        } else {
          setPrompt(true)
        }
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });
  };

  const handleBarCodeScanned = ({ type, data }) => {
    if (type == 32 && !wrongType && !error) {
      searchFoodByData(data);
      setBarcode(data);
    } else {
      setWrongType(true);
      setScanned(false);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Du måste ge Kostkollen åtkomst till din kamera för att använda den här funktionen.</Text>
      </View>)
  }
  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={[StyleSheet.absoluteFillObject, styles.cameraContainer]}
      />
      <View style={styles.scannerOutline}>
        <View style={styles.iconContainer}>
        </View>
      </View>
      <Text style={styles.centerText}>Positionera streckkoden i mitten</Text>
      {scanned && <Button title={'Tryck för att skanna igen'} onPress={() => setScanned(false)} />}
      {!openError && !wrongType && <Modal visible={prompt} animationType="fade" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Fel</Text>
            <Text style={styles.modalDescriptionSearch}>
              Det finns ingen mat med den streckkoden i vårt system. Vill du söka efter den?
            </Text>
            <View style={styles.buttonContainerAleart}>
              <TouchableOpacity style={styles.searchButton} onPress={() => { setPrompt(false); setScanned(false); setBarcode(''); navigate('Search'); }}>
                <Text style={styles.searchButtonText}>Sök</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setPrompt(false); setScanned(false) }} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Stäng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>}
      {!prompt && !wrongType &&
        <Modal visible={openError} animationType="fade" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Fel</Text>
              <Text style={styles.modalDescription}>
                Ett fel uppstod vid sökningen i databasen. Fel: {error}
              </Text>
              <TouchableOpacity onPress={() => { setOpenError(false); setScanned(false) }} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Stäng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>}
      {!openError && !prompt &&
        <Modal visible={wrongType} animationType="fade" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Fel</Text>
              <Text style={styles.modalDescription}>
                Koden du skannade är inte en giltig UPC-streckkod.
              </Text>
              <TouchableOpacity onPress={() => { setWrongType(false); setScanned(false) }} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Stäng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>}
    </View>
  );
}

const Homestack = createStackNavigator()

export default function ScannerStack({ route }) {
  const { user } = route.params;
  const [barcode, setBarcode] = useState('');
  const [loading, setLoading] = useState(false);
  const { reset } = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) {
      reset({ index: 0, routes: [{ name: "CodeScanner" }] });
    }
  }, [isFocused]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="green" />
      </View>
    )
  } else {
    return (
      <Homestack.Navigator>
        <Homestack.Screen name='CodeScanner' component={CodeScanner} options={{ headerTitle: 'Streckkodsläsare' }} initialParams={{ setBarcode, isFocused: isFocused }} />
        <Homestack.Screen name='FoodDetailScreen' component={FoodDetailScreen} options={({ route }) => ({ headerTitle: route.params.foodName })} />
        <Homestack.Screen name='Search' component={SearchStack} initialParams={{ user: user, barcode: barcode }} options={{ headerTitle: "Sök" }} />
      </Homestack.Navigator>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraContainer: {
    height: '115%',
    width: '146%'
  },
  scannerOutline: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: 'transparent',
    height: 200,
    width: 300,
  },
  iconContainer: {
    padding: 10,
  },
  centerText: {
    color: 'white',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    margin: 10
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
  modalDescriptionSearch: {
    fontSize: 13,
    textAlign: 'left'
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
  searchButton: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    width: '35%',
    alignItems: 'center',
    alignSelf: 'flex-end'
  },
  searchButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  buttonContainerAleart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },
  selectorBackground: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 5,
    width: 200,
    height: 50
  },
  selectorBarcodeContainer: {
    width: 90,
    height: 40,
    margin: 5,
    backgroundColor: "#00ff00",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center"
  },
  selectorTextContainer: {
    width: 90,
    height: 40,
    margin: 5,
    backgroundColor: "white",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center"
  }
});