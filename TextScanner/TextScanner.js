import 'react-native-reanimated'
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';
import { useCameraDevices, useFrameProcessor, Camera } from 'react-native-vision-camera';
import { runOnJS } from 'react-native-reanimated';
import TextRecognition from 'react-native-text-recognition';

const TextScanner = () => {
  const [text, setText] = useState(null)
  const [image, setImage] = useState(null)
  const devices = useCameraDevices();
  const cameraDevice = devices.back;

  useEffect(() => {
    if(image) {
      (async () => {
        const result = await TextRecognition.recognize(image)
        console.log(result)
      })()
    }
  }, [image])

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet'
    const image = frame.toString()
    runOnJS(setImage)(image)
  }, []);

  if (cameraDevice == null) {
    return <ActivityIndicator size="large" color="green" />;
  } else {
    return (
      <View>
        <Camera
        style={styles.camera}
        device={cameraDevice}
        isActive={true}
        frameProcessor={frameProcessor}
      />
        <View styles={styles.textContainer}>
          <Text style={styles.text}>{text}</Text>
        </View>
      </View>
    );
  }
};

export default TextScanner;

const styles = StyleSheet.create({
  textContainer: {
    position: 'absolute',
    bottom: 100,
    height: 100,
    width: 400,
    backgroundColor: 'white',
    zIndex: 1
  },
  text: {
    fontSize: 50
  },
  camera: {
    height: '100%',
    width: '100%',
    zIndex: 0
  }
})