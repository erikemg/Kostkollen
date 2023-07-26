import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onValue, limitToFirst, query } from '@firebase/database';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import FontAwesome5 from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AddFoodScreen from "./AddFoodScreen";
import { useNavigation } from '@react-navigation/native';
import { foodsInDb } from './firebase';
import FoodDetailScreen from './FoodDetailScreen';
import { usersRef } from './firebase';

function Search({ route }) {
  const [foods, setFoods] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [userAllergens, setUserAllergens] = useState({});
  const [foodKeyArray, setFoodKeyArray] = useState([])
  const { navigate } = useNavigation();
  const { user } = route.params

  useEffect(() => {
    const handleData = (snapshot) => {
      const data = snapshot.val();
      if (data && data[user.uid]) {
         setUserAllergens(data[user.uid])
      }
    };
  
    onValue(usersRef, handleData);
    }, []);

  const getIconContainerStyle = (containsStatus) => {
      switch (containsStatus) {
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
  
  setDisplayAllergens = (foodAllergens) => {
    if(userAllergens) {
      let items = 0;
      let column;
      let column1 = [];
      let column2 = [];
      let column3 = [];
      if(items < 2) {
            column = column1
          }
      if (items > 2 && items < 4) {
            column = column2
          }
      if (items > 4 && items < 6) {
            column = column3
          }
      Object.keys(userAllergens).forEach((allergen) => {
        if(userAllergens[allergen] > 0) {
          switch(allergen) {
            case "gluten": 
            if (items < 2) {
              column1.push(
                <View key={allergen} style={getIconContainerStyle(foodAllergens[allergen])}>
                  <MaterialCommunityIcons name="barley" size={15} color="white" />
                </View>
              );
            } else if (items < 4) {
              column2.push(
                <View key={allergen} style={getIconContainerStyle(foodAllergens[allergen])}>
                  <MaterialCommunityIcons name="barley" size={15} color="white" />
                </View>
              );
            } else if (items < 6) {
              column3.push(
                <View key={allergen} style={getIconContainerStyle(foodAllergens[allergen])}>
                  <MaterialCommunityIcons name="barley" size={15} color="white" />
                </View>
              );
            }
            break;
            case "dairy": 
            if (items < 2) {
              column1.push(
                <View key={allergen} style={getIconContainerStyle(foodAllergens[allergen])}>
                  <MaterialCommunityIcons name="cup-water" size={15} color="white" />
                </View>
              );
            } else if (items < 4) {
              column2.push(
                <View key={allergen} style={getIconContainerStyle(foodAllergens[allergen])}>
                  <MaterialCommunityIcons name="cup-water" size={15} color="white" />
                </View>
              );
            } else if (items < 6) {
              column3.push(
                <View key={allergen} style={getIconContainerStyle(foodAllergens[allergen])}>
                  <MaterialCommunityIcons name="cup-water" size={15} color="white" />
                </View>
              );
            }
            break;
            case "nuts": 
            if (items < 2) {
              column1.push(
                <View key={allergen} style={getIconContainerStyle(foodAllergens[allergen])}>
                  <MaterialCommunityIcons name="peanut" size={15} color="white" />
                </View>
              );
            } else if (items < 4) {
              column2.push(
                <View key={allergen} style={getIconContainerStyle(foodAllergens[allergen])}>
                  <MaterialCommunityIcons name="peanut" size={15} color="white" />
                </View>
              );
            } else if (items < 6) {
              column3.push(
                <View key={allergen} style={getIconContainerStyle(foodAllergens[allergen])}>
                  <MaterialCommunityIcons name="peanut" size={15} color="white" />
                </View>
              );
            }
            break;
            case "seafood":
              if (items < 2) {
                column1.push(
                  <View key={allergen} style={getIconContainerStyle(foodAllergens[allergen])}>
                    <MaterialCommunityIcons name="fish" size={15} color="white" />
                  </View>
                );
              } else if (items < 4) {
                column2.push(
                  <View key={allergen} style={getIconContainerStyle(foodAllergens[allergen])}>
                    <MaterialCommunityIcons name="fish" size={15} color="white" />
                  </View>
                );
              } else if (items < 6) {
                column3.push(
                  <View key={allergen} style={getIconContainerStyle(foodAllergens[allergen])}>
                    <MaterialCommunityIcons name="fish" size={15} color="white" />
                  </View>
                );
              }
            break;
            case "vegan":
              if (items < 2) {
                column1.push(
                  <View key={allergen} style={getIconContainerStyle(foodAllergens[allergen])}>
                    <MaterialCommunityIcons name="sprout" size={15} color="white" />
                  </View>
                );
              } else if (items < 4) {
                column2.push(
                  <View key={allergen} style={getIconContainerStyle(foodAllergens[allergen])}>
                    <MaterialCommunityIcons name="sprout" size={15} color="white" />
                  </View>
                );
              } else if (items < 6) {
                column3.push(
                  <View key={allergen} style={getIconContainerStyle(foodAllergens[allergen])}>
                    <MaterialCommunityIcons name="sprout" size={15} color="white" />
                  </View>
                );
              }
              break;
            case "vegetarian":
              if (items < 2) {
                column1.push(
                  <View key={allergen} style={getIconContainerStyle(foodAllergens[allergen])}>
                    <FontAwesome5 name="leaf" size={15} color="white" />
                  </View>
                );
              } else if (items < 4) {
                column2.push(
                  <View key={allergen} style={getIconContainerStyle(foodAllergens[allergen])}>
                    <FontAwesome5 name="leaf" size={15} color="white" />
                  </View>
                );
              } else if (items < 6) {
                column3.push(
                  <View key={allergen} style={getIconContainerStyle(foodAllergens[allergen])}>
                    <FontAwesome5 name="leaf" size={15} color="white" />
                  </View>
                );
              }
              break;
          }
          items ++
        }
      })
      return (
        <View style={styles.iconRow}>
          <View style={styles.iconColumn}>
            {column3}
          </View>
          <View style={styles.iconColumn}>
            {column2}
          </View>
          <View style={styles.iconColumn}>
            {column1}
          </View>
        </View>
      )
    }
  }

  useEffect(() => {
    const handleData = (snapshot) => {
      const foodsData = Object.values(snapshot.val());
      valObj = snapshot.val()
      setFoodKeyArray(Object.entries(valObj).map(([key]) => key));
      foodsData.sort((a, b) => b.timesClicked - a.timesClicked);
      setFoods(foodsData);
    };
    const foodsQuery = query(foodsInDb, limitToFirst(30))
    onValue(foodsQuery, handleData);
  }, []);

  useEffect(() => {
    if (searchQuery === '') {
      setSearchResults([]);
    } else {
      const results = foods.filter((food) =>
        food.foodName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
    }
  }, [searchQuery, foods]);

  let foodScreens = [];
  foodScreens = foods.map((food, index) => {
      return <Pressable style={styles.foodContainer} key={food.foodName} onPress={() => handlePress(food.foodName, food.foodBrand, food.allergens, foodKeyArray[index])}>
        <View>
          <Text style={styles.foodName}>{food.foodName}</Text>
          <Text style={styles.foodBrand}>{food.foodBrand}</Text>
        </View>
        <View>
            {setDisplayAllergens(food.allergens)}
        </View>
      </Pressable>
  }
  );

  const handlePress = (name, brand, allergens, foodId) => {
    navigate("FoodDetailScreen", { foodName: name, brandName: brand, allergensContainsInfo: allergens, foodId: foodId });
  };

  const searchScreens = searchResults.map((result, index) => (
    <Pressable style={styles.foodContainer} key={result.foodName} onPress={() => handlePress(result.foodName, result.foodBrand, result.allergens, foodKeyArray[index])}>
      <View>
        <Text style={styles.foodName}>{result.foodName}</Text>
        <Text style={styles.foodBrand}>{result.foodBrand}</Text>
      </View>
      <View>
            {setDisplayAllergens(result.allergens)}
        </View>
    </Pressable>
  ));

  if (foodScreens.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  return (
    <SafeAreaView>
      <View style={styles.searchContainer}>
        <FontAwesome5 name="search" size={28} color="#333" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a food"
          onChangeText={(text) => setSearchQuery(text)}
        />
      </View>
      {searchQuery !== '' && <Text style={styles.label}>Search results</Text>}
      {searchQuery === '' && <Text style={styles.label}>Popular</Text>}
      {searchQuery === '' ? <ScrollView>
        {foodScreens}
      </ScrollView> : <ScrollView>
        {searchScreens}
      </ScrollView>}
      <SafeAreaView style={styles.notFoundContainer}>
        <Text style={styles.noResults}>Did you not find what you were looking for?</Text>
        <TouchableOpacity style={styles.addFood} onPress={() => { navigate("AddFoodScreen") }}>
          <Text style={styles.addFoodText}>Add Food</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaView>
  );
}

const Homestack = createNativeStackNavigator();

export default function SearchStack({ route }) {
  const { user, barcode } = route.params
  return (
    <Homestack.Navigator>
      <Homestack.Screen name="SearchScreen" component={Search} options={{ headerTitle: "Search" }} initialParams={{user}}/>
      <Homestack.Screen name="AddFoodScreen" component={AddFoodScreen} options={{ headerTitle: "Add Food" }} initialParams={{barcodeInitial: barcode}}/>
      <Homestack.Screen
        name="FoodDetailScreen"
        component={FoodDetailScreen}
        options={({ route }) => ({ headerTitle: route.params.foodName })}
        initialParams={{barcode: barcode}}
      />
    </Homestack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  foodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginVertical: 2,
    marginHorizontal: 10,
    paddingHorizontal: 20,
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginTop: 5,
  },
  foodBrand: {
    fontSize: 16,
    marginBottom: 5,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#00FF00',
    borderRadius: 10,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  searchIcon: {
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
  },
  noResults: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
    marginBottom: 15,
    textAlign: "center",
  },
  addFood: {
    backgroundColor: '#00FF00',
    borderRadius: 50,
    width: 150,
    height: 50,
    justifyContent: "center",
  },
  notFoundContainer: {
    alignItems: 'center',
  },
  addFoodText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: "center",
    color: "white",
  },
  greenIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "center",
    backgroundColor: 'green',
    borderRadius: 50,
    marginLeft: 3,
    marginTop: 3,
    height: 20,
    width: 20
  },
  yellowIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "center",
    backgroundColor: '#ffd343',
    borderRadius: 50,
    marginLeft: 3,
    marginTop: 3,
    height: 20,
    width: 20
  },
  redIconContainer:  {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "center",
    backgroundColor: 'red',
    borderRadius: 50,
    marginLeft: 3,
    marginTop: 3,
    height: 20,
    width: 20
  },
  iconRow: {
    flexDirection: 'row',
    flexWrap: 'wrap', 
    marginBottom: 3,
    justifyContent: 'flex-start'
  },
});