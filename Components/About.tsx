import React from "react";
import { View, Text, StyleSheet } from "react-native";
import styles from "./Styles";
import { createStackNavigator } from "@react-navigation/stack";

export default function index() {
  const Stack = createStackNavigator();
  let child = () => {
    return (
      <View style={styles.help}>
        <Text style={StyleSheet.flatten([styles.text, { color: "#333" }])}>
          Thank you for using our Gift Snap App. This app was written by James
          Johnson and Alexandra Gostev. We completed this application as our
          final capstone project in completion of our computer science degree.
          We loved working on this application because we knew it would help
          people like us, who may not have the best memories or who enjoy
          staying organized. We plan on releasing a new update in 2021 so we
          appreciate you sticking with us until we can get more features updated
          and completed.
        </Text>
      </View>
    );
  };
  return (
    <Stack.Navigator
      screenOptions={{
        safeAreaInsets: {
          top: 50,
          bottom: 50,
        },
        headerStyle: { backgroundColor: "#858386" },
        headerTitleStyle: { fontSize: 30 },
      }}
    >
      <Stack.Screen name="About" component={child} />
    </Stack.Navigator>
  );
}
