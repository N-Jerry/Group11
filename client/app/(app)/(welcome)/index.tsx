import { router } from 'expo-router';
import React from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';
import Swiper from 'react-native-swiper';

const Onboarding = () => {
  return (
    <Swiper style={styles.wrapper} showsButtons={true}>
      <View style={styles.slide}>
        <Image source={require('../../assets/images/college.png')} style={styles.image} />
        <Text style={styles.title}>Atiu Tubo</Text>
        <Text style={styles.text}>Discover amazing features to enhance your experience.</Text>
      </View>
      <View style={styles.slide}>
        <Image source={require('../../assets/images/Professor-pana.png')} style={styles.image} />
        <Text style={styles.title}>Keep attendance</Text>
        <Text style={styles.text}>Streamline your attendance sessions .</Text>
      </View>
      <View style={styles.slide}>
        <Image source={require('../../assets/images/std.png')} style={styles.image} />
        <Text style={styles.title}>Mark Attendance</Text>
        <Text style={styles.text}>Indicate your attendance by simply using your fingerprints.</Text>
        <Button title="Finish" onPress={() => router.push('signup')} />
      </View>
    </Swiper>
  );
};

const styles = StyleSheet.create({
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginHorizontal: 40,
  },
});

export default Onboarding;
