import { StyleSheet, Dimensions } from "react-native";

let styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D8D3D3",
    alignItems: "center",
  },
  newContainer: {
    flex: 1,
    backgroundColor: "#D8D3D3",
    padding: 0,
  },
  loginContainer: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  help: {
    padding: 10,
    flex: 1,
    backgroundColor: "#D8D3D3",
  },
  button: {
    padding: 20,
    margin: 10,
    borderRadius: 5,
    alignItems: "center",
    backgroundColor: "#858386",
  },
  smbutton: {
    padding: 20,
    margin: 10,
    backgroundColor: "#858386",
    borderRadius: 5,
    alignItems: "center",
  },
  logo: {
    height: 300,
    width: 370,
    marginBottom: 20,
  },
  text: {
    color: "#F0F0F0",
    fontSize: Dimensions.get("window").width <= 375 ? 20 : 24,
  },
  buttonRow: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: "#D8D3D3",
  },
  input: {
    backgroundColor: "white",
    borderColor: "#fff",
    height: 60,
    width: "100%",
    borderRadius: 4,
    fontSize: 32,
    padding: 5,
  },
  label: {
    color: "black",
    marginTop: 20,
    fontSize: 32,
    padding: 10,
    backgroundColor: "#858386",
  },
});

export default styles;
