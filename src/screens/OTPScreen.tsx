import React, {useState, useEffect} from 'react';
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
import {api, apiCallWithoutHeader} from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import toastConfig from '../styles/toastConfig';

const OTPScreen = ({navigation, route}) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const {fromLogin, mobileNo} = route.params || {};

  useEffect(() => {
    if (fromLogin === undefined || mobileNo === undefined) {
      Alert.alert('Error', 'Navigation parameters missing.', [
        {
          text: 'OK',
          onPress: () => {
            navigation.replace('Login');
          },
        },
      ]);
    }
  }, [fromLogin, mobileNo, navigation]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleInputChange = text => {
    if (/^\d{0,6}$/.test(text)) {
      setOtp(text);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length === 6) {
      try {
        setLoading(true);
        const payload = {otp, mobileNo};
        const [success, response] = await apiCallWithoutHeader(
          '/users/login-token',
          'POST',
          payload,
        );
        if (success && response?.data?.success) {
          await AsyncStorage.setItem(
            'authToken',
            response.data?.message?.accesst,
          );
          await AsyncStorage.setItem(
            'mobileNo',
            response.data?.message?.user?.mobileNo,
          );

          Toast.show({
            type: 'success',
            text1: 'OTP Verified',
            text2: 'Your OTP has been successfully verified.',
          });

          const isKyc = response?.data?.message?.user?.isKYC;

          navigation.navigate(isKyc ? 'Profile' : 'KYC');
        }
      } catch (error: any) {
        const errorMessage = error.message.replace(/Error:\s?/i, '');
        console.error('Error during OTP:', errorMessage);
        Toast.show({
          type: 'error',
          text1: 'Verification Failed',
          text2: errorMessage,
        });
        throw error;
      } finally {
        setLoading(false);
      }
    } else {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please enter a valid 6-digit OTP.',
      });
    }
  };

  const handleResendOTP = async () => {
    if (timer === 0) {
      try {
        setLoading(true);
        const payload = {mobileNo};
        const response = await api.post('/users/login-otp', payload);

        if (response?.data) {
          Toast.show({
            type: 'success',
            text1: 'OTP Resent',
            text2: 'A new OTP has been sent to your mobile number.',
          });
          setOtp('');
          setTimer(120); // Set timer to 2 minutes
        }
      } catch (error: any) {
        console.error('Resend OTP Error:', error?.response?.data);
        let errorMessage = 'Something went wrong. Please try again.';
        const errorData = error?.response?.data?.message;

        if (errorData && typeof errorData === 'object') {
          const firstNonEmptyKey = Object.keys(errorData).find(
            key => errorData[key]?.trim() !== '',
          );
          errorMessage = firstNonEmptyKey
            ? errorData[firstNonEmptyKey]
            : errorMessage;
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }

        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: errorMessage,
        });
        throw error;
      } finally {
        setLoading(false);
      }
    }
  };

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
        placeholderTextColor="#bbb"
      />

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#BB86FC"
          style={styles.spinner}
        />
      ) : (
        <>
          <TouchableOpacity style={styles.button} onPress={handleVerifyOTP}>
            <Text style={styles.buttonText}>Verify</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, timer > 0 && {backgroundColor: '#333'}]}
            onPress={handleResendOTP}
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
    backgroundColor: '#121212',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFFFFF',
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 18,
    letterSpacing: 4,
    backgroundColor: '#1E1E1E',
    color: '#FFFFFF',
  },
  spinner: {
    marginVertical: 20,
  },
  button: {
    width: '80%',
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#BB86FC',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#121212',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OTPScreen;
