import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Button
        onPress={() => navigation.navigate("Capture")}
        title="Go to Capture"
      />
      <Button
        onPress={() => navigation.navigate("Profile")}
        title="Go to Profile"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
