import React, { Component } from "react";
import { Text, Image, View, Alert, TouchableOpacity } from "react-native";

import * as ExpoImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";

export default class ImagePicker extends Component {
  constructor(props) {
    super(props);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.state = {
      image: null,
    };
  }

  handleImageChange(image) {
    this.props.onChangeImage(image);
  }

  render() {
    return (
      <View
        style={{
          borderRadius: 5,
          margin: 20,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          height: 360,
        }}
      >
        <TouchableOpacity
          onPress={this._pickImage}
          style={{
            borderWidth: 2,
            borderColor: "#000",
            borderRadius: 5,
            padding: 5,
            display: "flex",
          }}
        >
          <Text
            style={{
              backgroundColor: "white",
              fontSize: this.state.image ? 24 : 32,
            }}
          >
            {this.state.image
              ? "Press Here to Retake Photo"
              : "Press Here To Take Picture"}
          </Text>
        </TouchableOpacity>
        <Text>{"\n"}</Text>
        {this.state.image && (
          <Image
            source={{ uri: this.state.image }}
            style={{ height: 240, width: 240 }}
          />
        )}
      </View>
    );
  }

  componentDidMount() {
    this.getPermissionAsync();
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(
        Permissions.CAMERA_ROLL,
        Permissions.CAMERA
      );
      if (status !== "granted") {
        Alert.alert(
          "Sorry, we need camera roll permissions to make this work!"
        );
      }
    }
  };

  _pickImage = async () => {
    let result = await ExpoImagePicker.launchCameraAsync({
      mediaTypes: ExpoImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      this.setState({ image: result.uri });
      this.handleImageChange(result);
    }
  };
}
