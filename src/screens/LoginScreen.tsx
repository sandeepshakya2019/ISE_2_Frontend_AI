import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';
import Logo from '../components/Shared/Logo';
import { api } from '../utils/api';
import toastConfig from '../styles/toastConfig';

const LoginScreen = ({ navigation }) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleMobileNumberChange = text => {
    setMobileNumber(text.replace(/[^0-9]/g, '').slice(0, 10));
  };

  const parseErrorMessage = error => {
    let errorMessage = 'Something went wrong. Please try again.';
    const errorData = error?.response?.data?.message;

    if (errorData && typeof errorData === 'object') {
      const firstNonEmptyKey = Object.keys(errorData).find(
        key => errorData[key]?.trim() !== ''
      );
      errorMessage = firstNonEmptyKey ? errorData[firstNonEmptyKey] : errorMessage;
    } else if (typeof errorData === 'string') {
      errorMessage = errorData;
    }

    return errorMessage;
  };

  const loginUser = useCallback(async () => {
    try {
      const response = await api.post('/users/login-otp', { mobileNo: mobileNumber });
      Toast.show({
        type: 'success',
        text1: 'OTP Sent',
        text2: 'Check your mobile number.',
      });
      return response;
    } catch (error) {
      console.error('Login Error:', error?.response?.data);
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: parseErrorMessage(error),
      });
      throw error;
    }
  }, [mobileNumber]);

  const handleGetOTP = async () => {
    if (mobileNumber.length !== 10) {
      return Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Enter a valid 10-digit mobile number.',
      });
    }

    if (!isTermsAccepted) {
      return Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Accept Terms and Conditions.',
      });
    }

    setLoading(true);
    try {
      await loginUser();
      navigation.replace('OTP', { fromLogin: true, mobileNo: mobileNumber });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Toast config={toastConfig} />
      <Logo />
      <Text style={styles.logo}>Login</Text>
      <TextInput
        placeholder="Enter Mobile Number"
        style={styles.input}
        keyboardType="numeric"
        value={mobileNumber}
        onChangeText={handleMobileNumberChange}
        placeholderTextColor="#888"
      />
      <TouchableOpacity
        onPress={() => setIsTermsAccepted(!isTermsAccepted)}
        style={styles.checkboxContainer}
      >
        <Text style={styles.checkbox}>
          {isTermsAccepted ? '☑' : '☐'} Accept Terms and Conditions
        </Text>
      </TouchableOpacity>
      {loading ? (
        <ActivityIndicator size="large" color="#1E90FF" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleGetOTP}>
          <Text style={styles.buttonText}>Get OTP</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        onPress={() => navigation.navigate('Register')}
        style={styles.linkButton}
      >
        <Text style={styles.linkText}>Don't have an account? Register here</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FC',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E90FF',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    borderWidth: 0,
    borderRadius: 30,
    padding: 15,
    marginVertical: 10,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  checkbox: {
    fontSize: 16,
    color: '#444',
  },
  button: {
    width: '100%',
    backgroundColor: '#1E90FF',
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  linkButton: {
    marginTop: 20,
  },
  linkText: {
    color: '#1E90FF',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
