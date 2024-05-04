// IntroductionScreen.js
import React, {useEffect} from "react";
import { View, Text, StyleSheet, Image } from 'react-native';

const IntroductionScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('LoginScreen');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/logo.png')} style={styles.image} />
   
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', // Màu nền trắng
  },
  image: {
    width: 250, // Độ rộng hình ảnh
    height: 200, // Chiều cao hình ảnh
    marginBottom: 20, // Khoảng cách giữa hình ảnh và văn bản
  },
  introText: {
    fontSize: 24,
    color: '#3498db',
  },
});

export default IntroductionScreen;
