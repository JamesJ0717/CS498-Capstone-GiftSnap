import React, { Component } from "react";
import { View, Image, Alert, AsyncStorage, Text } from "react-native";

import firebase from "firebase";
import * as Facebook from "expo-facebook";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Crypto from "expo-crypto";
import Spinner from "react-native-loading-spinner-overlay";
import { SocialIcon } from "react-native-elements";

import logo from "../assets/logo.png";
import styles from "./Styles";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: null,
      loading: false,
    };
  }

  loginWithFacebook = async () => {
    await Facebook.initializeAsync("527141008184478", "Gift Tracker");

    const { type, token } = await Facebook.logInWithReadPermissionsAsync({
      permissions: ["public_profile", "email"],
    });

    if (type === "success") {
      const credential = firebase.auth.FacebookAuthProvider.credential(token);

      this.setState({ loading: true });
      firebase
        .auth()
        .signInWithCredential(credential)
        .then((result) => {
          if (result.user) {
            AsyncStorage.setItem("uid", result.user.uid);
            this.setState({ loading: false });
            this.props.route.params.changeUID(result.user.uid);
          }
        })
        .catch((error) => {
          Alert.alert("Error Logging In!", error);
        });
    }
  };

  loginWithApple = async () => {
    const csrf = Math.random().toString(36).substring(2, 15);
    const nonce = Math.random().toString(36).substring(2, 10);
    const hashedNonce = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      nonce
    );
    const appleCredential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
      state: csrf,
      nonce: hashedNonce,
    });
    const { identityToken } = appleCredential;

    if (identityToken) {
      const provider = new firebase.auth.OAuthProvider("apple.com");
      const credential = provider.credential({
        idToken: identityToken,
        rawNonce: nonce,
      });
      this.setState({ loading: true });

      await firebase
        .auth()
        .signInWithCredential(credential)
        .then((result) => {
          if (result.user) {
            this.setState({ loading: false });
            Alert.alert("Successfully logged in!");
            AsyncStorage.setItem("uid", result.user.uid);
            this.props.route.params.changeUID(result.user.uid);
          }
        });
    }
  };
  setup = () => {
    AsyncStorage.getItem("uid").then((res) => this.setState({ uid: res }));
  };
  componentDidMount() {}
  render() {
    return (
      <>
        <View style={styles.loginContainer}>
          <Spinner
            visible={this.state.loading}
            textContent={"Loading..."}
            textStyle={styles.label}
            overlayColor="rgba(112, 115, 117, .65)"
          />
          <Image source={logo} style={styles.logo} />
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={
              AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
            }
            buttonStyle={
              AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
            }
            cornerRadius={5}
            style={{ width: 250, height: 50, margin: 10 }}
            onPress={this.loginWithApple}
          />
          <SocialIcon
            style={{ width: 250, height: 50, margin: 10, borderRadius: 5 }}
            title="Sign In With Facebook"
            button
            type="facebook"
            onPress={this.loginWithFacebook}
          />
        </View>
      </>
    );
  }
}
