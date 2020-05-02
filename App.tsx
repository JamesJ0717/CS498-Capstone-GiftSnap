import React, { useState } from "react";
import { Button, Alert, AsyncStorage } from "react-native";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import ErrorBoundary from "react-native-error-boundary";
import firebase from "firebase";
import {
  API_KEY,
  AUTH_DOMAIN,
  DATABASE_URL,
  STORAGE_BUCKET,
} from "react-native-dotenv";

import GiftAdder from "./Components/GiftAdder";
import Login from "./Components/Login";
import Homepage from "./Components/Homepage";
import PersonView from "./Components/PersonView";
import PersonAdder from "./Components/PersonAdder";
import About from "./Components/About";
import Help from "./Components/Help";

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  databaseURL: DATABASE_URL,
  storageBucket: STORAGE_BUCKET,
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
} else {
}
export default function index() {
  const [uid, setUID] = useState(null);

  let setup = () => {
    AsyncStorage.getItem("uid").then((res) => {
      console.log("res", res);
      setUID(null);
    });
  };

  let changeUID = (uid: string) => {
    setUID(uid);
  };

  const Stack = createStackNavigator();
  const Tab = createBottomTabNavigator();

  let home = () => {
    return (
      <Stack.Navigator
        screenOptions={{
          safeAreaInsets: {
            top: 50,
            bottom: 50,
          },
          headerStyle: { backgroundColor: "#858386" },
          headerTitleStyle: { fontSize: 30 },
          headerRight: () => (
            <Button
              color="#000"
              title={uid === null ? "" : "Logout"}
              onPress={() => {
                AsyncStorage.removeItem("uid", (err) => {
                  if (err) Alert.alert(err.name, err.message);
                });
                setUID(null);
              }}
            />
          ),
        }}
      >
        {uid === null ? (
          <Stack.Screen
            name="Login"
            component={Login}
            initialParams={{ changeUID }}
          />
        ) : (
          <>
            <Stack.Screen name="Home" component={Homepage} />
            <Stack.Screen
              name="NewGift"
              component={GiftAdder}
              options={({ route }) => ({
                title: "New Gift for " + route.params.name,
              })}
            />
            <Stack.Screen
              name="Person"
              component={PersonView}
              options={({ route }) => ({ title: route.params.name })}
            />
            <Stack.Screen name="NewPerson" component={PersonAdder} />
          </>
        )}
      </Stack.Navigator>
    );
  };

  return (
    <ErrorBoundary>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              switch (route.name) {
                case "About":
                  iconName = focused
                    ? "ios-information-circle"
                    : "ios-information-circle-outline";
                  break;
                case "Help":
                  iconName = focused ? "ios-list-box" : "ios-list";
                  break;
                case "Home":
                  iconName = "ios-home";
                  break;
                default:
                  break;
              }

              // You can return any component that you like here!
              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}
          tabBarOptions={{
            activeTintColor: "tomato",
            inactiveTintColor: "gray",
          }}
          initialRouteName="Home"
        >
          <Tab.Screen name="About" component={About} />
          <Tab.Screen name="Home" component={home} />
          <Tab.Screen name="Help" component={Help} />
        </Tab.Navigator>
      </NavigationContainer>
    </ErrorBoundary>
  );
}
