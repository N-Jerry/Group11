import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const Splash: React.FC = () => {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/atiutubo.png')} style={styles.logo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: '#fff'
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
  },
});

export default Splash;
