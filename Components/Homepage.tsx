import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  AsyncStorage,
  FlatList,
} from "react-native";
import firebase from "firebase";
import styles from "./Styles";
import { Icon } from "react-native-elements";

export default function index({ navigation }) {
  const [list, setList] = useState(null);
  const [edit, setEdit] = useState(false);

  let setup = () => {
    AsyncStorage.getItem("uid").then((res) => {
      firebase
        .database()
        .ref(`/people/${res}`)
        .once("value")
        .then((res) => {
          let people = [];

          res.forEach((nres) => {
            people.push(nres.toJSON());
          });
          return people;
        })
        .then((people) => {
          setList(
            <FlatList
              refreshing={false}
              onRefresh={() => {
                setup();
              }}
              style={{ width: "90%" }}
              data={people}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    backgroundColor: item.color.toLowerCase(),
                    padding: 20,
                    margin: 10,
                    borderRadius: 5,
                    alignItems: "center",
                  }}
                  onPress={() => {
                    navigation.navigate("Person", {
                      name: item.name,
                      color: item.color,
                    });
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.text}>{item.name}</Text>
                    <Icon
                      type="material"
                      name="delete"
                      disabled={edit ? false : true}
                      disabledStyle={{
                        height: 0,
                        width: 0,
                      }}
                      containerStyle={{}}
                      onPress={() => {
                        remove(item, res);
                        setEdit(false);
                      }}
                    />
                  </View>
                </TouchableOpacity>
              )}
              numColumns={1}
              keyExtractor={(item) => item.name}
            />
          );
        });
    });
  };

  let remove = (person: { name: string; color: string }, uid: string) => {
    firebase
      .database()
      .ref(`/people/${uid}`)
      .child(person.name + person.color.slice(1))
      .remove(() => {
        setEdit(false);
      });
  };

  useEffect(() => {
    navigation.addListener("focus", () => {
      setup();
    });
    setup();
  }, [edit]);

  return (
    <View style={styles.container}>
      {list}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.smbutton}
          onPress={() => navigation.navigate("NewPerson")}
        >
          <Text style={styles.text}>New Person</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.smbutton}
          onPress={() => {
            setEdit(!edit);
          }}
        >
          <Text style={styles.text}>{edit ? "Done" : "Remove Person"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
