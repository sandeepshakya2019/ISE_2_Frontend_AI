import React, {useEffect, useRef} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Animated, Image} from 'react-native';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {RootStackParamList} from '../navigation/types'; // Adjust the import path as necessary
import Logo from '../components/Shared/Logo';

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // Animation references
  const fadeAnim = useRef(new Animated.Value(0)).current; // Background fade-in
  const logoAnim = useRef(new Animated.Value(-100)).current; // Logo slide from top
  const contentAnim = useRef(new Animated.Value(50)).current; // Content slide from bottom

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500, // Smooth fade-in
        useNativeDriver: true,
      }),
      Animated.spring(logoAnim, {
        toValue: 0,
        friction: 6, // Smooth spring effect
        useNativeDriver: true,
      }),
      Animated.spring(contentAnim, {
        toValue: 0,
        friction: 6, // Smooth spring effect
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000', // Background fallback
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // Covers entire screen
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dark overlay for readability
  },
  logoContainer: {
    position: 'absolute',
    top: 50, // Better positioning for different screen sizes
    alignItems: 'center',
  },
  contentContainer: {
    position: 'absolute',
    bottom: 80, //  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000', // Background fallback
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // Covers entire screen
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dark overlay for readability
  },
  logoContainer: {
    position: 'absolute',
    top: 50, // Better positioning for different screen sizes
    alignItems: 'center',
  },
  contentContainer: {
    position: 'absolute',
    bottom: 80, // Adjusted for better visibility
    alignItems: 'center',
    width: '100%',
  },
  text: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FACB11', // Warm, readable text
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 15,
    letterSpacing: 1.2, // Better readability
    lineHeight: 32, // Optimal line height
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
    elevation: 4, // Subtle shadow for depth
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

// export default HomeScreen; (Removed duplicate export)
