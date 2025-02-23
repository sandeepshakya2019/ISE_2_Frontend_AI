import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Alert,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Toast from 'react-native-toast-message';
import Logo from '../components/Shared/Logo';
import { api, apiCallWithoutHeader } from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import toastConfig from '../styles/toastConfig';

const OTPScreen = ({ navigation, route }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const intervalRef = useRef(null);
  const { fromLogin, mobileNo } = route.params || {};

  useEffect(() => {
    if (!fromLogin || !mobileNo) {
      Alert.alert('Error', 'Navigation parameters missing.', [
        {
          text: 'OK',
          onPress: () => navigation.replace('Login'),
        },
      ]);
    }
  }, [fromLogin, mobileNo, navigation]);

  useEffect(() => {
    if (timer > 0) {
      intervalRef.current = setInterval(() => {
        setTimer(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [timer]);

  const handleInputChange = text => {
    if (/^\d{0,6}$/.test(text)) setOtp(text);
  };

  const verifyOTP = useCallback(async () => {
    if (otp.length !== 6) {
      return Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please enter a valid 6-digit OTP.',
      });
    }

    try {
      setLoading(true);
      const payload = { otp, mobileNo };
      const [success, response] = await apiCallWithoutHeader(
        '/users/login-token',
        'POST',
        payload
      );

      if (success && response?.data?.success) {
        const { accesst, user } = response.data?.message;
        await AsyncStorage.setItem('authToken', accesst);
        await AsyncStorage.setItem('mobileNo', user?.mobileNo);

        Toast.show({
          type: 'success',
          text1: 'OTP Verified',
          text2: 'Your OTP has been successfully verified.',
        });

        navigation.navigate(user?.isKYC ? 'Profile' : 'KYC');
      }
    } catch (error) {
      console.error('Error during OTP verification:', error.message);
      Toast.show({
        type: 'error',
        text1: 'Verification Failed',
        text2: error.message.replace(/Error:\s?/i, ''),
      });
    } finally {
      setLoading(false);
    }
  }, [otp, mobileNo, navigation]);

  const resendOTP = useCallback(async () => {
    if (timer > 0) return;

    try {
      setLoading(true);
      const response = await api.post('/users/login-otp', { mobileNo });

      if (response?.data) {
        Toast.show({
          type: 'success',
          text1: 'OTP Resent',
          text2: 'A new OTP has been sent to your mobile number.',
        });
        setOtp('');
        setTimer(120);
      }
    } catch (error) {
      console.error('Resend OTP Error:', error?.response?.data);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.response?.data?.message || 'Something went wrong. Try again.',
      });
    } finally {
      setLoading(false);
    }
  }, [mobileNo, timer]);

  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <View style={styles.container}>
      <Toast config={toastConfig} />
      <Logo />
      <Text style={styles.headerText}>Enter OTP</Text>
      <TextInput
        style={styles.input}
        value={otp}
        onChangeText={handleInputChange}
        keyboardType="numeric"
        maxLength={6}
        placeholder="Enter OTP"
        autoFocus
        textAlign="center"
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.spinner} />
      ) : (
        <>
          <TouchableOpacity style={styles.button} onPress={verifyOTP}>
            <Text style={styles.buttonText}>Verify</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, timer > 0 && { backgroundColor: '#ccc' }]}
            onPress={resendOTP}
            disabled={timer > 0}>
            <Text style={styles.buttonText}>
              {timer > 0 ? `Resend OTP (${formatTime(timer)})` : 'Resend OTP'}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 18,
    letterSpacing: 4,
    backgroundColor: '#fff',
  },
  spinner: {
    marginVertical: 20,
  },
  button: {
    width: '80%',
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#007bff',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OTPScreen;
