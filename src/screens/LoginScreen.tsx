import React, {useState} from 'react';
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
import {api} from '../utils/api';
import toastConfig from '../styles/toastConfig';

const LoginScreen = ({navigation}) => {
  const [mobileNumber, setMobileNumber] = useState('9084043946');

  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const loginUser = async () => {
    try {
      const payload = {mobileNo: mobileNumber};
      const response = await api.post('/users/login-otp', payload);
      Toast.show({
        type: 'success',
        text1: 'OTP Sent',
        text2: 'Please check your mobile number.',
      });
      return response;
    } catch (error: any) {
      console.error('Login Error:', error?.response?.data);

      let errorMessage = 'Something went wrong. Please try again.'; // Default message
      const errorData = error?.response?.data?.message;

      // Check if `errorData` is an object and find the first key with a non-empty value
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
        text1: 'Login Failed',
        text2: errorMessage,
      });

      throw error;
    }
  };

  const handleGetOTP = async () => {
    if (!mobileNumber || mobileNumber.length !== 10) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Enter a valid 10-digit mobile number.',
      });
      return;
    }
    if (!isTermsAccepted) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Accept Terms and Conditions.',
      });
      return;
    }
    setLoading(true);
    try {
      await loginUser();
      navigation.replace('OTP', {fromLogin: true, mobileNo: mobileNumber});
    } finally {
      setLoading(false);
    }
  };

  const handleMobileNumberChange = text => {
    const formattedText = text.replace(/[^0-9]/g, '').slice(0, 10);
    setMobileNumber(formattedText);
  };

  const handleRegisterNavigation = () => {
    navigation.navigate('Register');
  };

  return (
    <View style={styles.container}>
      <Toast config={toastConfig} />
      <Logo />
      <Text style={styles.title}>Login</Text>
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
        style={styles.checkboxContainer}>
        <Text style={styles.checkboxText}>
          {isTermsAccepted ? '☑' : '☐'} Accept Terms and Conditions
        </Text>
      </TouchableOpacity>
      {loading ? (
        <ActivityIndicator size="large" color="#BB86FC" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleGetOTP}>
          <Text style={styles.buttonText}>Get OTP</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        onPress={handleRegisterNavigation}
        style={styles.linkButton}>
        <Text style={styles.linkText}>
          Don't have an account? Register here
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: '#1E1E1E',
    borderRadius: 25,
    padding: 15,
    marginVertical: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333333',
    color: '#FFFFFF',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  checkboxText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  button: {
    width: '100%',
    backgroundColor: '#BB86FC',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#121212',
  },
  linkButton: {
    marginTop: 20,
  },
  linkText: {
    color: '#BB86FC',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
