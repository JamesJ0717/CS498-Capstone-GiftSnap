import React, { useState } from "react";
import {
  Alert,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  AsyncStorage,
  Keyboard,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import ImagePicker from "./ImagePicker";
import firebase from "firebase";
import styles from "./Styles";
import { ScrollView } from "react-native-gesture-handler";
import Spinner from "react-native-loading-spinner-overlay";

export default function GiftAdder({ route, navigation }) {
  const { control, handleSubmit, errors } = useForm<FormData>();
  const [giftName, setName] = useState("");
  const [holidayFor, setHolidayFor] = useState("");
  const [description, setDescription] = useState("");
  const [picture, setPicture] = useState(null);
  const [loading, setLoading] = useState(false);
  let createGift = () => {
    if (picture === null) {
      Alert.alert("Missing Information", "You forgot to choose a picture");
      setTimeout(() => setLoading(false), 500);
      return;
    }
    AsyncStorage.getItem("uid").then(async (uid) => {
      fetch(picture.uri)
        .then((res) =>
          res.blob().then((blob) => {
            firebase
              .storage()
              .ref("/pictures/" + uid)
              .child(giftName + route.params.name)
              .put(blob)
              .then(async (res) => {
                firebase
                  .database()
                  .ref(`/gifts/${uid}`)
                  .child(giftName + route.params.name)
                  .set({
                    giftName: giftName,
                    giftFor: route.params.name,
                    holidayFor: holidayFor,
                    picture: await res.ref.getDownloadURL(),
                    description: description,
                    createdAt: Date.now(),
                    // tags: tags.tagsArray,
                  })
                  .then(() => {
                    Alert.alert("Congrats!", "Gift Successfully Created!");
                    setLoading(false);
                    return navigation.pop();
                  })
                  .catch(() => Alert.alert("Error", "Internal Server Error!"));
              })
              .catch((err) => console.error(err));
          })
        )
        .catch((err) => Alert.alert(err));
    });
  };

  return (
    <ScrollView>
      <Spinner
        visible={loading}
        textContent={"Creating your gift..."}
        textStyle={styles.text}
        cancellable={true}
      />
      <View style={styles.newContainer}>
        <Text style={styles.label}>Gift Name: </Text>
        <Controller
          as={
            <TextInput
              onSubmitEditing={Keyboard.dismiss}
              placeholder="Enter Gift Name Here"
              style={styles.input}
            />
          }
          control={control}
          onChangeText={(text: string) => setName(text)}
          name="name"
        />
        <Text style={styles.label}>Holiday: </Text>
        <Controller
          as={
            <TextInput
              onSubmitEditing={Keyboard.dismiss}
              placeholder="Enter Holiday Here"
              style={styles.input}
            />
          }
          control={control}
          name="holidayFor"
          onChangeText={(text: string) => setHolidayFor(text)}
        />
        <Text style={styles.label}>Description: </Text>
        <Controller
          as={
            <TextInput
              onSubmitEditing={Keyboard.dismiss}
              placeholder="Enter Description Here"
              style={styles.input}
            />
          }
          control={control}
          name="holidayFor"
          onChangeText={(text: string) => setDescription(text)}
        />
        <Text style={styles.label}>Picture: </Text>
        <ImagePicker
          onChangeImage={(image) => {
            setPicture(image);
          }}
        ></ImagePicker>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            createGift();
            setLoading(true);
          }}
        >
          <Text style={styles.text}>Create Gift</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
