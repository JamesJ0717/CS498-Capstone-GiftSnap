import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  AsyncStorage,
  Keyboard,
} from "react-native";
import { useForm, Controller } from "react-hook-form";

import NativeColorPicker from "native-color-picker";

import firebase from "firebase";

import styles from "./Styles";

function PersonAdder({ navigation }) {
  const { control, handleSubmit, errors } = useForm<FormData>();
  let [name, setName] = useState("");
  let [color, setColor] = useState("");
  const [uid, setUID] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem("uid").then((res) => setUID(res));
  }, []);

  let addNewPerson = (name: string, color: string) => {
    if (name === "" || color === "") {
      Alert.alert(
        "Missing Information",
        "You forgot to choose a name or a color"
      );
      return;
    }
    firebase
      .database()
      .ref(`/people/${uid}`)
      .child(name + color.slice(1))
      .set({
        name: name,
        color: color,
      })
      .then(() => {
        Alert.alert("Successfully created new person", name);
        navigation.navigate("Home");
      })
      .catch((err) => Alert.alert(err));
  };

  return (
    <>
      <View style={styles.newContainer}>
        <Text style={styles.label}>Name: </Text>
        <Controller
          as={
            <TextInput
              onSubmitEditing={Keyboard.dismiss}
              placeholder="Enter Name Here"
              style={styles.input}
            />
          }
          control={control}
          onChangeText={(text: string) => setName(text)}
          name="name"
        />
        <Text style={styles.label}>Select a Color: </Text>
        <NativeColorPicker
          colors={[
            "#d73964",
            "#d23440",
            "#db643a",
            "#e88334",
            "#e2a71e",
            "#e25241",
            "#d0da59",
            "#4053ae",
            "#70b949",
            "#73564a",
            "#67ab5a",
            "#8f36aa",
            "#f6c244",
            "#52b9d0",
            "#4595ec",
            "#009688",
            "#5abeA7",
            "#4a97e4",
            "#2d68cd",
            "#9946c7",
            "#d9639e",
            "#6d6f74",
            "#939287",
            "#868ea3",
          ]}
          selectedColor={color}
          markerType="checkmark"
          markerDisplay="adjust"
          onSelect={(item) => setColor(item)}
          scrollEnabled={true}
          // columns={6}
          style={{ backgroundColor: "white", maxHeight: 280 }}
        />
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          onPress={() => addNewPerson(name, color)}
          style={styles.smbutton}
        >
          <Text style={styles.text}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          style={styles.smbutton}
        >
          <Text style={styles.text}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

export default PersonAdder;
