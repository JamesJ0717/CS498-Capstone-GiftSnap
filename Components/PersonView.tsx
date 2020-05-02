import React, { Component } from "react";
import {
  Text,
  View,
  FlatList,
  AsyncStorage,
  ActivityIndicator,
} from "react-native";
import firebase from "firebase";
import styles from "./Styles";
import { TouchableOpacity } from "react-native-gesture-handler";
import GiftView from "./GiftView";
import { SearchBar } from "react-native-elements";
import Gift from "../Models/Gift";

type Props = { route: { params: { color: string; name: string } }; navigation };
type State = {
  gifts: any[];
  edit: boolean;
  list: JSX.Element;
  text: string;
  loading: boolean;
};

export default class PersonView extends Component<Props, State> {
  arrayHolder: any[];
  constructor(props) {
    super(props);
    this.state = {
      gifts: [],
      edit: false,
      list: null,
      text: "",
      loading: false,
    };
    this.arrayHolder = [];
  }

  deleteGift = async (gift: Gift) => {
    AsyncStorage.getItem("uid").then((uid) => {
      firebase
        .database()
        .ref(`/gifts/${uid}`)
        .child(gift.giftName + gift.giftFor)
        .remove(() => this.setup());
    });
  };

  setup = () =>
    AsyncStorage.getItem("uid").then((res) => {
      firebase
        .database()
        .ref(`/gifts/${res}`)
        .orderByKey()
        .once("value")
        .then((res) => {
          let array = [];
          res.forEach((gift) => {
            let newGift = gift.toJSON();
            if (newGift.giftFor === this.props.route.params.name) {
              array.push(newGift);
            }
          });

          array.sort((gift1, gift2) =>
            gift1.createdAt > gift2.createdAt ? -1 : 1
          );
          this.arrayHolder = array;
          this.setState({
            gifts: array,
            loading: false,
          });
          return array;
        });
    });

  componentDidMount() {
    this.setState({ loading: true });
    this.setup();
    this.props.navigation.addListener("focus", () => {
      this.setup();
    });
  }

  header = () => {
    return (
      <SearchBar
        placeholder="Search..."
        round
        onChangeText={(text) => this.search(text)}
        autoCorrect={false}
        value={this.state.text}
      />
    );
  };

  search = (text: string) => {
    this.setState({ text: text });
    let textData = text.toUpperCase();

    let localGifts = this.arrayHolder.filter((gift) => {
      let name = gift.giftName.toUpperCase();
      let description = gift.description.toUpperCase();
      let holiday = gift.holidayFor.toUpperCase();

      return (
        name.indexOf(textData) > -1 ||
        description.indexOf(textData) > -1 ||
        holiday.indexOf(textData) > -1
      );
    });

    this.setState({ gifts: localGifts });
  };

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <FlatList
          style={{ width: "100%" }}
          data={this.state.gifts}
          renderItem={({ item }) => (
            <GiftView
              gift={item}
              color={this.props.route.params.color}
              editable={this.state.edit}
              delete={this.deleteGift}
            />
          )}
          numColumns={1}
          keyExtractor={(item) => item.giftName}
          ListHeaderComponent={this.header}
        />
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.smbutton}
            onPress={() =>
              this.props.navigation.navigate("NewGift", {
                name: this.props.route.params.name,
              })
            }
          >
            <Text style={styles.text}>Add A New Gift</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.smbutton}
            onPress={() => {
              this.setState({ edit: !this.state.edit });
            }}
          >
            <Text style={styles.text}>
              {this.state.edit ? "Done" : "Remove A Gift"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
