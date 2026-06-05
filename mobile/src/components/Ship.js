import React, { useRef, useEffect } from 'react';
import { StyleSheet, Animated, Easing, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function Ship() {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -8, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 8, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true })
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, { toValue: -1, duration: 2500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(rotateAnim, { toValue: 1, duration: 2500, easing: Easing.inOut(Easing.ease), useNativeDriver: true })
      ])
    ).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-6deg', '6deg']
  });

  return (
    <Animated.View style={[
      styles.shipContainer, 
      { transform: [{ translateY: floatAnim }, { rotateZ: spin }] }
    ]}>
       <Animated.Text style={styles.sail}>⛵️</Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  shipContainer: {
    position: 'absolute',
    bottom: 50, // Stick to bottom of map
    left: width / 2 - 35, // Center perfectly
    height: 70,
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: -5, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
    elevation: 10,
  },
  sail: {
    fontSize: 60,
  }
});
