import React from "react";
import { Text, View, FlatList, StyleSheet } from "react-native";
import styles from "./Styles";
import { createStackNavigator } from "@react-navigation/stack";

export default function Help() {
  const Stack = createStackNavigator();
  let questions = [
    "Welcome to the Gift Snap App! Thank you for downloading! Here are some common questions and answers to help you use the application. If you have any more questions or comments feel free to email us at: giftsnapapp@gmail.com",
    "Q: How do I create a person?\nA: In the home screen of the application, press on “Add new person”.",
    "Q: Where are my photos saved?\nA: Your photos are saved on a server, only available for you to see.",
    "Q: Is my login information secure?\nA: Yes, we use Facebook and Apple login to ensure that our users have the most secure login experience.",
    "Q: Will I be able to access my photos on another device?\nA: Yes, since everything is saved on our server you can access your photos anywhere on any device as long as you use the same login.",
    "Q: How do I add a new gift?\nA: Inside of a specific person you press a button called “Add new gift”.",
    "Q: How do I delete a person or a gift?\nA: At the bottom of the Homepage and Person View is a button that says either 'Remove a Person' or 'Remove A Gift'.",
    "Q: What rating should you rate our app?\nA: 11/10 😉",
  ];
  let child = () => {
    return (
      <View style={styles.help}>
        <FlatList
          data={questions}
          renderItem={(data) => (
            <Text style={StyleSheet.flatten([styles.text, { color: "#333" }])}>
              {data.item}
              {"\n"}
            </Text>
          )}
          keyExtractor={(item) => item}
        ></FlatList>
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
      <Stack.Screen name="Help" component={child} />
    </Stack.Navigator>
  );
}
