import React, {useEffect, useRef} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Animated} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Logo from '../components/Shared/Logo';

export default function HomeScreen() {
  const navigation = useNavigation();

  // Animation references
  const fadeAnim = useRef(new Animated.Value(0)).current; // For background image opacity
  const logoAnim = useRef(new Animated.Value(-100)).current; // For logo from top
  const contentAnim = useRef(new Animated.Value(100)).current; // For text and button from bottom

  useEffect(() => {
    // Animate background, logo, and content sequentially
    Animated.parallel([
      // Fade in the background image (slower)
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 2000, // Increased duration for slower fade-in
        useNativeDriver: true,
      }),
      // Slide the logo from top (slower and smoother)
      Animated.spring(logoAnim, {
        toValue: 2,
        friction: 8, // Lower friction for smoother animation
        useNativeDriver: true,
      }),
      // Slide the text and button from bottom (slower and smoother)
      Animated.spring(contentAnim, {
        toValue: 2,
        friction: 8, // Lower friction for smoother animation
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, logoAnim, contentAnim]);

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <View style={styles.container}>
      {/* Background Image */}
      <Animated.Image
        source={require('../assets/images/back.jpeg')}
        style={[
          styles.backgroundImage,
          {
            opacity: fadeAnim, // Bind fade animation to opacity
          },
        ]}
      />

      {/* Overlay for blackish effect */}
      <View style={styles.overlay} />

      {/* Animated Logo - Positioned at the top */}
      <Animated.View
        style={{
          transform: [{translateY: logoAnim}], // Move from top
          position: 'absolute',
          top: 40, // Adjust top position of logo
        }}>
        <Logo />
      </Animated.View>

      {/* Content: Text and Button */}
      <Animated.View
        style={[
          styles.contentContainer,
          {
            transform: [{translateY: contentAnim}], // Move from bottom
          },
        ]}>
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        style={[
          styles.textContainer,
          {
            transform: [{translateX: contentAnim}], // Move from bottom
          },
        ]}>
        <Text style={styles.text}>Small Loans, Big Impact On Rural Lives</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  logoContainer: {
    position: 'absolute',
    top: 40,
  },
  contentContainer: {
    position: 'absolute',
    bottom: 100,
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  textContainer: {
    position: 'absolute',
    bottom: 20,
    alignItems: 'center',
    width: '100%',
  },
  text: {
    fontSize: 28,
    color: '#FACA11',
    textAlign: 'center',
    fontWeight: '800',
    paddingHorizontal: 10,
    letterSpacing: 1,
    lineHeight: 30,
  },
  button: {
    backgroundColor: '#BB86FC',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#121212',
    fontWeight: 'bold',
  },
});
