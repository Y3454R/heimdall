import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Camera } from "expo-camera";
import { MaterialIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import * as Location from "expo-location";

export default function CaptureScreen() {
  const [type, setType] = useState(Camera.Constants.Type.front);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const cameraRef = useRef(null);
  const isFocused = useIsFocused();

  const setup = () => {
    (async () => {
      if (cameraRef.current && permission && permission.granted && isFocused) {
        await cameraRef.current.resumePreview();
      }
    })();
  };
  const dependencies = [permission, isFocused];
  useEffect(setup, dependencies);

  if (!permission) {
    // permission na paile ki hobe
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={{ color: "white" }}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  async function handleCapture() {
    if (cameraRef.current) {
      // Photo
      let photo = await cameraRef.current.takePictureAsync();
      console.log(photo);
      // Do something with the captured photo

      // Location
      const getLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();

        // If permission not given
        if (status !== "granted") {
          console.log("Permission to access location was denied");
          return;
        }

        const loc = await Location.getCurrentPositionAsync({});
        return loc;
      };

      let location = await getLocation();
      console.log(location);

      // Timestamp
      const time = new Date();
      const year = time.getFullYear();
      const month = String(time.getMonth() + 1).padStart(2, "0"); // Adjust month format to MM
      const day = String(time.getDate()).padStart(2, "0"); // Adjust day format to DD
      const hour = String(time.getHours()).padStart(2, "0"); // Adjust hour format to HH
      const minute = String(time.getMinutes()).padStart(2, "0"); // Adjust minute format to MM
      const second = String(time.getSeconds()).padStart(2, "0"); // Adjust second format to SS
      const timestamp = `${year}-${month}-${day} ${hour}:${minute}:${second}`; // PostgreSQL format
      console.log(timestamp);

      // send photo, location and timestamp to backend
    }
  }

  function toggleCameraType() {
    setType(
      type === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  }

  return (
    <View style={styles.container}>
      {isFocused && (
        <Camera style={styles.camera} type={type} ref={cameraRef} />
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
          <MaterialIcons name="sync" size={32} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>
          <View style={styles.captureInnerButton} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "black",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "blue",
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
  },
  captureInnerButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "white",
    backgroundColor: "transparent",
  },
});
