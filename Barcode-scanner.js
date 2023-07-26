import React, { useState, useLayoutEffect, useEffect } from 'react';
import { Text, View, StyleSheet, ActivityIndicator, Modal, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation, useIsFocused, addListener, navigation} from '@react-navigation/native';
import FoodDetailScreen from './FoodDetailScreen';
import SearchStack from './Search';
import { onValue, equalTo, query, orderByChild, get} from 'firebase/database';
import { foodsInDb } from './firebase';

const CodeScanner = ({route, navigation}) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [prompt, setPrompt] = useState(false);
  const [error, setError] = useState('')
  const [openError, setOpenError] = useState(false)
  const [wrongType, setWrongType] = useState(false)
  const [scanned, setScanned] = useState(false);
  const {setBarcode, isFocused} = route.params
  const { navigate } = useNavigation()

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
      const foodQuery = query(foodsInDb, orderByChild('barcode'), equalTo(data));

      get(foodQuery)
      onValue(foodQuery, (snapshot) => {
          if(snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
              const food = childSnapshot.val();
              const foodKey = childSnapshot.key;
              if (foodKey != null) {
                navigate('FoodDetailScreen', {
                  foodName: food.foodName,
                  brandName: food.foodBrand,
                  allergensContainsInfo: food.allergens,
                  foodId: foodKey,
                });
              setScanned(false)
              setBarcode('')
              }
            });
          } else {
            setPrompt(true)
          }
        }, (error) => {
          setError(error)
          setOpenError(true)
        });
  };
  
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    if (type == 32 && !wrongType && !error) {
      searchFoodByData(data)
      setBarcode(data)
      setScanned(false)
    } else {
      setWrongType(true)
      setScanned(false)
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
      <Text style={styles.header}>You need to give FoodCheck access to your camera to use this feature.</Text>
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
      <Text style={styles.centerText}>Position Barcode in the Center</Text>
      {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
      {!openError && !wrongType && <Modal visible={prompt} animationType="fade" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Error</Text>
            <Text style={styles.modalDescriptionSearch}>
                There is no food with that barcode in our system, do you want to search for it?
            </Text>
            <View style={styles.buttonContainerAleart}>
              <TouchableOpacity style={styles.searchButton} onPress={() => {setPrompt(false); setScanned(false); setBarcode(''); navigate('Search');}}>
                <Text style={styles.searchButtonText}>Search</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {setPrompt(false); setScanned(false)}} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>}
      {!prompt && !wrongType &&
      <Modal visible={openError} animationType="fade" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Error</Text>
          <Text style={styles.modalDescription}>
          An error occurred while searching the database. Error: {error}
          </Text>
            <TouchableOpacity onPress={() => {setOpenError(false); setScanned(false)}} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
        </View>
      </View>
      </Modal>}
      {!openError && !prompt && 
      <Modal visible={wrongType} animationType="fade" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Error</Text>
          <Text style={styles.modalDescription}>
          The code you scanned is not a valid UPC barcode.
          </Text>
            <TouchableOpacity onPress={() => {setWrongType(false); setScanned(false)}} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
        </View>
      </View>
    </Modal>}
    </View>
  );
}

const Homestack = createStackNavigator()

export default function ScannerStack({ route }) {
  const {user} = route.params
  const [barcode, setBarcode] = useState('')
  const [loading, setLoading] = useState(false)
  const { reset } = useNavigation()
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) {
      reset({ index: 0, routes: [{ name: "CodeScanner" }] });
    }
  }, [isFocused]);

  if(loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="green" />
      </View>
    )
  } else {
    return (
      <Homestack.Navigator>
        <Homestack.Screen name='CodeScanner' component={CodeScanner} options={{ headerTitle: 'Barcode Scanner' }} initialParams={{setBarcode, isFocused: isFocused}}/>
        <Homestack.Screen name='FoodDetailScreen' component={FoodDetailScreen} options={({ route }) => ({ headerTitle: route.params.foodName })} />
        <Homestack.Screen name='Search' component={SearchStack} initialParams={{user: user, barcode: barcode}} options={{headerShown: false}}/>
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
});