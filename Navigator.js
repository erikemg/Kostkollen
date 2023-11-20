import React, {useEffect} from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BackHandler } from "react-native";
import FontAwesome5 from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import SettingsStack from "./settings";
import ScannerStack from "./Barcode-scanner";
import SearchStack from "./Search";

const Tab = createBottomTabNavigator();

export default function Navigation({ setInfoEntered, user, setVerified }) {

    const handleBackPress = () => {
        return true;
      };

    return (
    <NavigationContainer>
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, focused, size }) => {
                    let iconName;
                    if (route.name === "Search") {
                        iconName = "search";
                        return <FontAwesome5 name={iconName} size={28} color={color} />;
                    } else if (route.name === "Barcode Scanner") {
                        iconName = "scan-helper";
                        return <MaterialCommunityIcons name={iconName} size={28} color={color} />;
                    } else if (route.name === "Settings") {
                        iconName = "cog";
                        return <FontAwesome5 name={iconName} size={28} color={color} />;
                    }
                    return null;
                },
                tabBarShowLabel: false,
                tabBarActiveTintColor: "#00FF00"
            })}
        >
            <Tab.Screen name="Search" component={SearchStack} options={{ headerShown: false }} initialParams={{user}}/>
            <Tab.Screen name="Barcode Scanner" component={ScannerStack} options={{ headerShown: false }} initialParams={{user}}/>
            <Tab.Screen name="Settings" component={SettingsStack} options={{ headerShown: false }} initialParams={{setInfoEntered: (info) => setInfoEntered(info), setVerified: (info) => setVerified(info)}}/>
        </Tab.Navigator>
    </NavigationContainer>
    );
}