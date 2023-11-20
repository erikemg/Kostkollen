import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, BackHandler, Image } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onValue, child, update } from '@firebase/database';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import FontAwesome5 from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AddFoodScreen from "./AddFoodScreen";
import { useNavigation } from '@react-navigation/native';
import FoodDetailScreen from './FoodDetailScreen';
import InfoModal from './InfoModal';
import { usersRef } from './firebase';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-7402081473871492/8813220240';

function Search({ route }) {
  const [foods, setFoods] = useState([]);
  const [foodScreens, setFoodScreens] = useState([])
  const [history, setHistory] = useState({})
  const [searchQuery, setSearchQuery] = useState('');
  const [searchQuerySubmit, setSearchQuerySumbit] = useState(false)
  const [searchResults, setSearchResults] = useState([]);
  const [userAllergens, setUserAllergens] = useState({});
  const [uid, setUid] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showInfo, setShowInfo] = useState(false);
  const { navigate } = useNavigation();
  const { user, barcode } = route.params

  useEffect(() => {
    const handleData = (snapshot) => {
      const data = snapshot.val();
      if (data && data[user.uid]) {
        setUserAllergens(data[user.uid].allergens)
        setUid(user.uid)
        if(data[user.uid].history) {
          const foodsArray = []
          Object.keys(data[user.uid].history).forEach((key) => {
            foodsArray.push(data[user.uid].history[key])
          })
          setFoods(foodsArray)
          setHistory(data[user.uid].history)
        }
      }
    };

    onValue(usersRef, handleData);
  }, []);

  useEffect(() => {
    if(barcode) {
        const onBackPress = () => {
          navigate('CodeScanner')
          return true
        };
  
        const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
  
        return () => subscription.remove();
    }}, [])

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

  const truncateName = (foodName) => {
    const maxLength = 15;
    if (foodName.length <= maxLength) {
      return foodName;
    } else {
      return foodName.slice(0, maxLength - 3) + '...';
    }
  }
  

  setDisplayAllergens = (foodAllergens) => {
    if (userAllergens) {
      let items = 0;
      let column1 = [];
      let column2 = [];
      let column3 = [];
      let column4 = [];
      let column5 = [];
      Object.keys(userAllergens).forEach((allergen) => {
        if (userAllergens[allergen] > 0) {
          switch (allergen) {
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
              } else if (items < 8) {
                column4.push(
                  <View key={allergen} style={getIconContainerStyle(foodAllergens[allergen])}>
                    <MaterialCommunityIcons name="barley" size={15} color="white" />
                  </View>
                );
              } else if (items < 10) {
                column5.push(
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
              } else if (items < 8) {
                column4.push(
                  <View key={allergen} style={getIconContainerStyle(foodAllergens[allergen])}>
                    <MaterialCommunityIcons name="cup-water" size={15} color="white" />
                  </View>
                );
              } else if (items < 10) {
                column5.push(
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
              } else if (items < 8) {
                column4.push(
                  <View key={allergen} style={getIconContainerStyle(foodAllergens[allergen])}>
                    <MaterialCommunityIcons name="peanut" size={15} color="white" />
                  </View>
                );
              } else if (items < 10) {
                column5.push(
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
              } else if (items < 8) {
                column4.push(
                  <View key={allergen} style={getIconContainerStyle(foodAllergens[allergen])}>
                    <MaterialCommunityIcons name="fish" size={15} color="white" />
                  </View>
                );
              } else if (items < 10) {
                column5.push(
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
              } else if (items < 8) {
                column4.push(
                  <View key={allergen} style={getIconContainerStyle(foodAllergens[allergen])}>
                    <MaterialCommunityIcons name="sprout" size={15} color="white" />
                  </View>
                );
              } else if (items < 10) {
                column5.push(
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
              } else if (items < 8) {
                column4.push(
                  <View key={allergen} style={getIconContainerStyle(foodAllergens[allergen])}>
                    <FontAwesome5 name="leaf" size={15} color="white" />
                  </View>
                );
              } else if (items < 10) {
                column5.push(
                  <View key={allergen} style={getIconContainerStyle(foodAllergens[allergen])}>
                    <FontAwesome5 name="leaf" size={15} color="white" />
                  </View>
                );
              }
              break;
            case "sugar":
              if (items < 2) {
                column1.push(
                  <View key={allergen} style={getIconContainerStyle(foodAllergens[allergen])}>
                    <MaterialCommunityIcons name="cube-outline" size={15} color="white" />
                  </View>
                );
              } else if (items < 4) {
                column2.push(
                  <View key={allergen} style={getIconContainerStyle(foodAllergens[allergen])}>
                    <MaterialCommunityIcons name="cube-outline" size={15} color="white" />
                  </View>
                );
              } else if (items < 6) {
                column3.push(
                  <View key={allergen} style={getIconContainerStyle(foodAllergens[allergen])}>
                    <MaterialCommunityIcons name="cube-outline" size={15} color="white" />
                  </View>
                );
              } else if (items < 8) {
                column4.push(
                  <View key={allergen} style={getIconContainerStyle(foodAllergens[allergen])}>
                    <MaterialCommunityIcons name="cube-outline" size={15} color="white" />
                  </View>
                );
              } else if (items < 10) {
                column5.push(
                  <View key={allergen} style={getIconContainerStyle(foodAllergens[allergen])}>
                    <MaterialCommunityIcons name="cube-outline" size={15} color="white" />
                  </View>
                );
              }
              break;
              case "keto":
              if (items < 2) {
                column1.push(
                  <View key={allergen} style={getIconContainerStyle(foodAllergens[allergen])}>
                    <MaterialCommunityIcons name="food-steak" size={15} color="white" />
                  </View>
                );
              } else if (items < 4) {
                column2.push(
                  <View key={allergen} style={getIconContainerStyle(foodAllergens[allergen])}>
                    <MaterialCommunityIcons name="food-steak" size={15} color="white" />
                  </View>
                );
              } else if (items < 6) {
                column3.push(
                  <View key={allergen} style={getIconContainerStyle(foodAllergens[allergen])}>
                    <MaterialCommunityIcons name="food-steak" size={15} color="white" />
                  </View>
                );
              } else if (items < 8) {
                column4.push(
                  <View key={allergen} style={getIconContainerStyle(foodAllergens[allergen])}>
                    <MaterialCommunityIcons name="food-steak" size={15} color="white" />
                  </View>
                );
              } else if (items < 10) {
                column5.push(
                  <View key={allergen} style={getIconContainerStyle(foodAllergens[allergen])}>
                    <MaterialCommunityIcons name="food-steak" size={15} color="white" />
                  </View>
                );
              }
              break;
              case "eggs":
              if (items < 2) {
                column1.push(
                  <View key={allergen} style={getIconContainerStyle(foodAllergens[allergen])}>
                    <MaterialCommunityIcons name="egg" size={15} color="white" />
                  </View>
                );
              } else if (items < 4) {
                column2.push(
                  <View key={allergen} style={getIconContainerStyle(foodAllergens[allergen])}>
                    <MaterialCommunityIcons name="egg" size={15} color="white" />
                  </View>
                );
              } else if (items < 6) {
                column3.push(
                  <View key={allergen} style={getIconContainerStyle(foodAllergens[allergen])}>
                    <MaterialCommunityIcons name="egg" size={15} color="white" />
                  </View>
                );
              } else if (items < 8) {
                column4.push(
                  <View key={allergen} style={getIconContainerStyle(foodAllergens[allergen])}>
                    <MaterialCommunityIcons name="egg" size={15} color="white" />
                  </View>
                );
              } else if (items < 10) {
                column5.push(
                  <View key={allergen} style={getIconContainerStyle(foodAllergens[allergen])}>
                    <MaterialCommunityIcons name="egg" size={15} color="white" />
                  </View>
                );
              }
              break;
          }
          items++
        }
      })
      return (
        <View style={styles.iconRow}>
          <View style={styles.iconColumn}>
            {column5}
          </View>
          <View style={styles.iconColumn}>
            {column4}
          </View>
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
    const searchDatabase = async (data) => {
      await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${data}&lc=sv&search_simple=1&action=process&json=1`)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            setPrompt(true)
          }
        })
        .then((data) => {
          let foodsFromDB = []
          data.products.forEach(product => {
            const product_name = product.product_name || "Unknown";
            const nutrition_info = product.nutriments || {};
            const brands = product.brands || "Uknown"
            const data_sources = product.data_sources || null
            let verified = null

            getAllergens = (allergen) => {
              switch(allergen) {
                case "dairy": 
                if(product.allergens_tags.includes("en:milk")) {
                  return 0
                } else if (product.traces_tags.includes("en:milk")) {
                  return 1
                } else {
                  return 2
                }
                case "eggs":
                if(product.allergens_tags.includes("en:eggs")) {
                  return 0
                } else if (product.traces_tags.includes("en:eggs")) {
                  return 1
                } else {
                  return 2
                }
                case "gluten":
                  if(product.allergens_tags.includes("en:gluten")) {
                    return 0
                  } else if (product.traces_tags.includes("en:gluten")) {
                    return 1
                  } else {
                    return 2
                  }
                case "keto":
                  if(product.nutriments.carbohydrates == 0) {
                    return 2
                  } else if (product.nutriments.carbohydrates <= 5) {
                    return 1
                  } else {
                    return 0
                  }
                case "nuts":
                  if(product.allergens_tags.includes("en:nuts")) {
                    return 0
                  } else if (product.traces_tags.includes("en:nuts")) {
                    return 1
                  } else {
                    return 2
                  }
                case "seafood":
                  if(product.allergens_tags.includes("en:fish")) {
                    return 0
                  } else if (product.traces_tags.includes("en:fish")) {
                    return 1
                  } else {
                    return 2
                  }
                case "sugar":
                  if(product.nutriments.sugar_value == 0) {
                    return 2
                  } else if (product.nutriments.sugar_value <= 5) {
                    return 1
                  } else {
                    return 0
                  }
                  case "vegan": 
                  if (product.ingredients_analysis_tags && product.ingredients_analysis_tags.includes("en:vegan")) {
                    return 2;
                  } else if (product.ingredients_analysis_tags && product.ingredients_analysis_tags.includes("en:vegan-status-unknown")) {
                    return -1;
                  } else {
                    return 0;
                  }
                 case "vegetarian": 
                  if (product.ingredients_analysis_tags && product.ingredients_analysis_tags.includes("en:vegetarian")) {
                    return 2;
                  } else if (product.ingredients_analysis_tags && product.ingredients_analysis_tags.includes("en:vegetarian-status-unknown")) {
                    return -1;
                  } else if (!product.ingredients_analysis_tags) {
                    return -1
                  } else {
                    return 0;
                  }
              }
            }

            if (data_sources) {
              let sources = data_sources.split(",");
              if (sources.includes(" Producers")) {
                verified = true
              } else {
                verified = false
              }
            }
            
            foodsFromDB.push({
              allergens: {
                  dairy: getAllergens("dairy"),
                  eggs: getAllergens("eggs"),
                  gluten: getAllergens("gluten"),
                  keto: getAllergens("keto"),
                  nuts: getAllergens("nuts"),
                  seafood: getAllergens("seafood"),
                  sugar: getAllergens("sugar"),
                  vegan: getAllergens("vegan"),
                  vegetarian: getAllergens("vegetarian")
              },
              foodBrand: brands,
              foodName: product_name,
              verified: verified
            })
          });
          setSearchResults(foodsFromDB)
          setLoading(false)
        })
        .catch((error) => {
          console.error("Error:", error.message);
        });
  }
  if(searchQuerySubmit != false) {
    setLoading(true)
    searchDatabase(searchQuery)
  }
  }, [searchQuerySubmit]);

  useEffect(() => {
      setFoodScreens(foods.map((food, index) => {
        if(index == 2) {
          return (
            <View style={styles.adAndFoodContainer}>
              <View>
              <BannerAd
      unitId={adUnitId}
      size={BannerAdSize.BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
      }}
    />
              </View>
              <Pressable style={styles.foodContainer} key={index} onPress={() => handlePress(food.foodName, food.foodBrand, food.allergens, food.verified)}>
          <View>
            <View style={styles.nameAndVerified}>
              <Text style={styles.foodName}>{truncateName(food.foodName)}</Text>
              {food.verified && <MaterialIcons style={styles.verifiedIcon} name="verified-user" size={15}/> }
            </View>
            <Text style={styles.foodBrand}>{truncateName(food.foodBrand)}</Text>
          </View>
          <View>
            {setDisplayAllergens(food.allergens)}
          </View>
        </Pressable>
            </View>
          )
        } else {
          return (
          <View style={styles.adAndFoodContainer}>
            <Pressable style={styles.foodContainer} key={index} onPress={() => handlePress(food.foodName, food.foodBrand, food.allergens, food.verified)}>
          <View>
            <View style={styles.nameAndVerified}>
              <Text style={styles.foodName}>{truncateName(food.foodName)}</Text>
              {food.verified && <MaterialIcons style={styles.verifiedIcon} name="verified-user" size={15}/> }
            </View>
            <Text style={styles.foodBrand}>{truncateName(food.foodBrand)}</Text>
          </View>
          <View>
            {setDisplayAllergens(food.allergens)}
          </View>
        </Pressable>
          </View>
      )}
      }));
      setLoading(false)
  }, [foods])

  const addToHistory = async (name, brand, allergens, verified) => {
      const currentHistory = history
      let newName = name
      let tempName = name
      let i = 2
      while(currentHistory[name]) {
        i += 1
        tempName = `${name} ${i}`
        if(!currentHistory[tempName])
        newName = `${name} ${i}`
      }

      if(!verified) {
        verified = false
      }

      currentHistory[name] = {
        allergens: allergens,
        foodBrand: brand,
        foodName: name,
        verified: verified
      }

      const userRef = child(usersRef, uid);
      const userHistoryRef = child(userRef, 'history');

      await update(userHistoryRef, currentHistory);
  };

  const handlePress = (name, brand, allergens, verified) => {
    addToHistory(name, brand, allergens, verified)
    navigate("FoodDetailScreen", { foodName: name, brandName: brand, allergensContainsInfo: allergens, verified: verified});
  };

  const handleSearch = (text) => {
    if(searchQuerySubmit != false) {
      setSearchQuerySumbit('')
    }
    setSearchQuery(text)
    setFoodScreens([])
    const areCharactersIncluded = (substring, fullString) => {
      for (let i = 0; i < substring.length; i++) {
        const char = substring.charAt(i);
        if (fullString.indexOf(char) === -1) {
          return false;
        }
      }
      return true;
    }
    if(text != "") {
      setFoodScreens(foods.map((food, index) => {
        if(areCharactersIncluded(text, food.foodName) || areCharactersIncluded(text, food.foodBrand)) {
          return <Pressable style={styles.foodContainer} key={index} onPress={() => handlePress(food.foodName, food.foodBrand, food.allergens, food.verified)}>
          <View>
            <View style={styles.nameAndVerified}>
              <Text style={styles.foodName}>{truncateName(food.foodName)}</Text>
              {food.verified && <MaterialIcons style={styles.verifiedIcon} name="verified-user" size={15}/> }
            </View>
            <Text style={styles.foodBrand}>{truncateName(food.foodBrand)}</Text>
          </View>
          <View>
            {setDisplayAllergens(food.allergens)}
          </View>
        </Pressable>
        }
      }));
    } else {
      setFoodScreens(foods.map((food, index) => {
        return <Pressable style={styles.foodContainer} key={index} onPress={() => handlePress(food.foodName, food.foodBrand, food.allergens, food.verified)}>
          <View>
            <View style={styles.nameAndVerified}>
              <Text style={styles.foodName}>{truncateName(food.foodName)}</Text>
              {food.verified && <MaterialIcons style={styles.verifiedIcon} name="verified-user" size={15}/> }
            </View>
            <Text style={styles.foodBrand}>{truncateName(food.foodBrand)}</Text>
          </View>
          <View>
            {setDisplayAllergens(food.allergens)}
          </View>
        </Pressable>
      }));
    }
  }

  const searchScreens = searchResults.map((result, index) => (
    <Pressable style={styles.foodContainer} key={index} onPress={() => handlePress(result.foodName, result.foodBrand, result.allergens)}>
      <View>
        <View style={styles.nameAndVerified}>
          <Text style={styles.foodName}>{truncateName(result.foodName)}</Text>
          {result.verified && <MaterialIcons style={styles.verifiedIcon} name="verified-user" size={15}/>}
        </View>
        <Text style={styles.foodBrand}>{truncateName(result.foodBrand)}</Text>
      </View>
      <View>
        {setDisplayAllergens(result.allergens)}
      </View>
    </Pressable>
  ));

  return (
    <View>
      <View style={styles.searchContainer}>
        <FontAwesome5 name="search" size={28} color="#333" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Sök efter en matvara"
          onChangeText={text => handleSearch(text)}
          onSubmitEditing={() => setSearchQuerySumbit(true)}
        />
      </View>
      <View style={styles.labelContainer}>
        {searchQuerySubmit != false && <Text style={styles.label}>Sökresultat</Text>}
        {searchQuerySubmit == false && <Text style={styles.label}>Historik</Text>}
        <TouchableOpacity onPress={() => { setShowInfo(true) }} style={styles.infoButton}>
          <Text style={styles.infoButtonText}>i</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
      <View style={{justifyContent: 'center', alignItems: 'center', height: 500 }}>
      <ActivityIndicator size="large" color="green" />
    </View>) : foods.length === 0 && !searchQuerySubmit? (
    <View>
      <View style={styles.emptyContainer}>
        <Image
        source={require('./empty.png')}
        style={styles.image}
        />
        <Text style={styles.smallHeader}>Vad tomt det är, testa söka efter någonting.</Text>
      </View>
    </View>
     )
    : searchQuerySubmit == false ? <ScrollView>
        {foodScreens}
        <View style={styles.notFoundContainer}>
          <Text style={styles.noResults}>Hittade du inte det du letade efter?</Text>
          <TouchableOpacity style={styles.addFood} onPress={() => { navigate("AddFoodScreen") }}>
            <Text style={styles.addFoodText}>Lägg till matvara</Text>
          </TouchableOpacity>
        </View>
      </ScrollView> : <ScrollView>
        {searchScreens}
        <View style={styles.notFoundContainer}>
          <Text style={styles.noResults}>Hittade du inte det du letade efter?</Text>
          <TouchableOpacity style={styles.addFood} onPress={() => { navigate("AddFoodScreen") }}>
            <Text style={styles.addFoodText}>Lägg till matvara</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>}
      {showInfo && <InfoModal setShowInfo={info => setShowInfo(info)} showInfo={showInfo} />}
    </View>
  );
}

const Homestack = createNativeStackNavigator();

export default function SearchStack({ route }) {
  const { user, barcode } = route.params
  return (
    <Homestack.Navigator>
      <Homestack.Screen name="SearchScreen" component={Search} options={{ headerTitle: "Sök", headerShown: !barcode }} initialParams={{ user, barcode }} />
      <Homestack.Screen name="AddFoodScreen" component={AddFoodScreen} options={{ headerTitle: "Lägg till matvara", headerShown: !barcode }} initialParams={{ barcodeInitial: barcode }} />
      <Homestack.Screen
        name="FoodDetailScreen"
        component={FoodDetailScreen}
        options={({ route }) => ({ headerTitle: route.params.foodName })}
        initialParams={{ barcode: barcode }}
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
    width: 370,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginVertical: 2,
    marginHorizontal: 10,
    paddingHorizontal: 20,
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  foodBrand: {
    fontSize: 16,
    marginBottom: 5,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#00FF00',
    borderRadius: 10,
    marginHorizontal: 10,
    marginBottom: 10,
    marginTop: 10
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
    width: 170,
    height: 50,
    justifyContent: "center",
  },
  notFoundContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    height: 250
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
  greyIconContainer:  {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "center",
    backgroundColor: 'grey',
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
  infoButton: {
    backgroundColor: '#333',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  infoButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  nameAndVerified: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedIcon: {
    paddingTop: 7,
    paddingLeft: 3,
    color: "green"
  },
  image: {
    width: 200,
    height: 200
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 300
  },
  smallHeader: {
    fontWeight: 500
  },
  adAndFoodContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  }
});