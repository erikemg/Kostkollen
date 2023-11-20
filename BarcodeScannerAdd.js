import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ActivityIndicator, Modal, TouchableOpacity, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

const CodeScanner = ({ setBarcode, setScannerOpen }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [wrongType, setWrongType] = useState(false);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const unsubscribe = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };
  
    unsubscribe();
  
  }, []);
  

  const handleBarCodeScanned = ({ type, data }) => {
    if (type == 32 && !wrongType) {
      setBarcode(data);
      setScannerOpen(false)
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
      {wrongType &&
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

export default CodeScanner

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