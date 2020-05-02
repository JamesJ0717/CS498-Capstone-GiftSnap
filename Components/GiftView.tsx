import React, { useState, useEffect } from "react";
import { View, Text, Image, ActivityIndicator } from "react-native";
import { Icon } from "react-native-elements";

import styles from "./Styles";
import Gift from "../Models/Gift";

type Props = {
  gift: Gift;
  color: string;
  editable: boolean;
  delete: (Gift) => void;
};

let index = (props: Props) => {
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null);
  useEffect(() => {
    setImage(Image.prefetch(gift.picture));
  }, []);
  let gift = props.gift;

  return (
    <View
      style={{
        backgroundColor: props.color.toLowerCase(),
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
        margin: 5,
        padding: 5,
      }}
    >
      <Icon
        type="material"
        name="delete"
        disabled={props.editable ? false : true}
        disabledStyle={{ height: 0, width: 0 }}
        containerStyle={{ alignSelf: "flex-end" }}
        onPress={() => {
          props.delete(gift);
        }}
      />
      <Text style={styles.text}>{gift.giftName}</Text>
      <Text style={styles.text}>{gift.holidayFor}</Text>
      <ActivityIndicator size="large" animating={loading ? true : false} />
      <Image
        source={{ uri: gift.picture }}
        onLoad={() => setLoading(false)}
        style={styles.logo}
      />

      <Text style={styles.text}>{gift.description}</Text>
    </View>
  );
};

export default index;
